import json
import os

import psycopg2


def handler(event: dict, context) -> dict:
    """Список заявок и изменение статуса для панели администратора"""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    password = event.get('headers', {}).get('x-admin-password') or event.get('headers', {}).get('X-Admin-Password')
    if password != os.environ.get('ADMIN_PASSWORD'):
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Неверный пароль'})}

    schema = os.environ['MAIN_DB_SCHEMA']
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if method == 'GET':
        cur.execute(
            f"SELECT id, nick, age, phone, online_hours, vk, about, status, created_at "
            f"FROM {schema}.applications ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        result = [
            {
                'id': r[0],
                'nick': r[1],
                'age': r[2],
                'phone': r[3],
                'online_hours': r[4],
                'vk': r[5],
                'about': r[6],
                'status': r[7],
                'created_at': r[8].isoformat(),
            }
            for r in rows
        ]
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result)}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        app_id = body.get('id')
        status = body.get('status')
        allowed = {'sent', 'review', 'interview', 'accepted', 'rejected'}
        if not app_id or status not in allowed:
            cur.close()
            conn.close()
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Некорректные данные'})}

        cur.execute(
            f"UPDATE {schema}.applications SET status = %s, updated_at = NOW() WHERE id = %s",
            (status, app_id),
        )
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True})}

    cur.close()
    conn.close()
    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}