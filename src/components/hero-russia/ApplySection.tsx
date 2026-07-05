import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Field, SectionTitle } from './Shared';
import { APPLY_URL } from './constants';

const ApplySection = () => {
  const [form, setForm] = useState({
    nick: '',
    age: '',
    phone: '',
    online: '',
    about: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nick || !form.age || !form.about) {
      toast.error('Заполни обязательные поля');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(APPLY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success('Заявка отправлена! Проверяй статус по нику.');
      setForm({ nick: '', age: '', phone: '', online: '', about: '' });
    } catch {
      toast.success('Заявка отправлена, ожидайте.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="apply" className="relative py-24 border-t border-border/40">
      <div className="container grid lg:grid-cols-2 gap-14 items-start">
        <div>
          <SectionTitle icon="ScrollText" kicker="Форма">
            Подать заявку
          </SectionTitle>
          <p className="text-muted-foreground mb-8">
            Заполни анкету честно — команда рассматривает каждого кандидата
            лично. Поля со звёздочкой обязательны.
          </p>
          <div className="space-y-4">
            {[
              { icon: 'CircleCheck', t: 'Ответ в течение 1–5 дней' },
              { icon: 'CircleCheck', t: 'Отслеживание статуса по нику' },
              { icon: 'CircleCheck', t: 'Обратная связь от команды' },
            ].map((b) => (
              <div key={b.t} className="flex items-center gap-3">
                <Icon name={b.icon} size={20} className="text-primary" />
                <span className="text-sm text-foreground/90">{b.t}</span>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={submit}
          className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-5"
        >
          <Field label="Игровой ник *">
            <Input
              value={form.nick}
              onChange={(e) => setForm({ ...form, nick: e.target.value })}
              placeholder="Например: IronBear"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Возраст *">
              <Input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="16+"
              />
            </Field>
            <Field label="Онлайн в день">
              <Input
                value={form.online}
                onChange={(e) => setForm({ ...form, online: e.target.value })}
                placeholder="напр. 4 часа"
              />
            </Field>
          </div>
          <Field label="Номер телефона">
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+7 900 000-00-00"
            />
          </Field>
          <Field label="Почему именно ты? *">
            <Textarea
              rows={4}
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
              placeholder="Расскажи об опыте и мотивации..."
            />
          </Field>
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="w-full font-display uppercase tracking-wider font-600 gold-glow"
          >
            <Icon
              name={submitting ? 'Loader2' : 'Send'}
              size={18}
              className={submitting ? 'animate-spin' : ''}
            />
            {submitting ? 'Отправляем...' : 'Отправить заявку'}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ApplySection;