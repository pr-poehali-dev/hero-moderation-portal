import json
import os
import smtplib
from email.mime.text import MIMEText

import psycopg2


def handler(event: dict, context) -> dict:
    """Принимает заявку на модератора, сохраняет в БД и отправляет письмо на почту"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        nick = (body.get('nick') or '').strip()
        age = body.get('age')
        phone = (body.get('phone') or '').strip()
        online_hours = (body.get('online') or '').strip()
        about = (body.get('about') or '').strip()

        if not nick or not age or not about:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Заполните обязательные поля'}),
            }

        schema = os.environ['MAIN_DB_SCHEMA']
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {schema}.applications (nick, age, phone, online_hours, about) "
            f"VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (nick, int(age), phone, online_hours, about),
        )
        app_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        send_notification(app_id, nick, age, phone, online_hours, about)

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'success': True, 'id': app_id}),
        }

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        nick = (params.get('nick') or '').strip()
        if not nick:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Укажите ник'}),
            }

        schema = os.environ['MAIN_DB_SCHEMA']
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, nick, status, created_at FROM {schema}.applications "
            f"WHERE LOWER(nick) = LOWER(%s) ORDER BY created_at DESC LIMIT 1",
            (nick,),
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Заявка не найдена'}),
            }

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'id': row[0],
                'nick': row[1],
                'status': row[2],
                'created_at': row[3].isoformat(),
            }),
        }

    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}


def send_notification(app_id, nick, age, phone, online_hours, about):
    sender = os.environ.get('SMTP_EMAIL')
    password = os.environ.get('SMTP_PASSWORD')
    if not sender or not password:
        return

    text = (
        f"Новая заявка на модератора №{app_id}\n\n"
        f"Ник: {nick}\n"
        f"Возраст: {age}\n"
        f"Телефон: {phone or '-'}\n"
        f"Онлайн: {online_hours or '-'}\n\n"
        f"Почему именно он:\n{about}"
    )
    msg = MIMEText(text, 'plain', 'utf-8')
    msg['Subject'] = f'Новая заявка HERO RUSSIA #{app_id} — {nick}'
    msg['From'] = sender
    msg['To'] = 'standoff2ggq482@gmail.com'

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(sender, password)
        server.sendmail(sender, ['standoff2ggq482@gmail.com'], msg.as_string())
