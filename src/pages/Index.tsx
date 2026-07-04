import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';

const APPLY_URL = 'https://functions.poehali.dev/b839d72f-e05c-44f4-b265-512fc311173d';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/0d7f3f74-dcb1-4374-adf9-9768dc0253a4/files/b41257e6-c3fe-4035-92d1-fc44aba4f4be.jpg';

const NAV = [
  { id: 'home', label: 'Главная' },
  { id: 'apply', label: 'Подать заявку' },
  { id: 'status', label: 'Статус заявки' },
  { id: 'faq', label: 'Вопросы' },
];

const FAQ = [
  {
    q: 'Какие требования к кандидату в модераторы?',
    a: 'Возраст от 16 лет, стабильный онлайн от 3 часов в день, знание правил сервера, отсутствие блокировок за последние 6 месяцев и адекватность в общении.',
  },
  {
    q: 'Сколько рассматривается заявка?',
    a: 'В среднем от 1 до 5 дней. Ты можешь отслеживать статус в разделе «Статус заявки» по своему игровому нику.',
  },
  {
    q: 'Что делает модератор на сервере?',
    a: 'Следит за порядком в чате и голосовых, реагирует на жалобы игроков, выдаёт наказания нарушителям и помогает новичкам освоиться.',
  },
  {
    q: 'Можно ли подать повторную заявку после отказа?',
    a: 'Да, повторная подача возможна через 14 дней после отклонения. Рекомендуем учесть замечания из ответа команды.',
  },
];

const STATUS_STEPS = [
  { key: 'sent', label: 'Заявка получена', icon: 'Inbox' },
  { key: 'review', label: 'На рассмотрении', icon: 'ScanSearch' },
  { key: 'interview', label: 'Собеседование', icon: 'Mic' },
  { key: 'done', label: 'Решение принято', icon: 'ShieldCheck' },
];

const STATUS_MAP: Record<string, { step: number; label: string }> = {
  sent: { step: 0, label: 'Заявка получена' },
  review: { step: 1, label: 'На рассмотрении' },
  interview: { step: 2, label: 'Собеседование' },
  accepted: { step: 3, label: 'Принят' },
  rejected: { step: 3, label: 'Отклонено' },
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <Label className="text-sm text-foreground/90">{label}</Label>
    {children}
  </div>
);

const SectionTitle = ({
  icon,
  kicker,
  children,
  center,
}: {
  icon: string;
  kicker: string;
  children: React.ReactNode;
  center?: boolean;
}) => (
  <div className={center ? 'flex flex-col items-center' : ''}>
    <div className="inline-flex items-center gap-2 mb-3 text-primary">
      <Icon name={icon} size={16} />
      <span className="text-xs uppercase tracking-[0.2em] font-medium">
        {kicker}
      </span>
    </div>
    <h2 className="font-display font-700 uppercase text-4xl sm:text-5xl mb-4 tracking-tight">
      {children}
    </h2>
  </div>
);

const Index = () => {
  const [form, setForm] = useState({
    nick: '',
    age: '',
    phone: '',
    online: '',
    about: '',
  });
  const [checkNick, setCheckNick] = useState('');
  const [tracked, setTracked] = useState<null | {
    id: number;
    nick: string;
    status: string;
  }>(null);
  const [submitting, setSubmitting] = useState(false);
  const [tracking, setTracking] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

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
      toast.error('Не удалось отправить заявку. Попробуй позже.');
    } finally {
      setSubmitting(false);
    }
  };

  const track = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkNick.trim()) {
      toast.error('Введи игровой ник');
      return;
    }
    setTracking(true);
    try {
      const res = await fetch(
        `${APPLY_URL}?nick=${encodeURIComponent(checkNick.trim())}`,
      );
      if (res.status === 404) {
        toast.error('Заявка с таким ником не найдена');
        setTracked(null);
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTracked(data);
    } catch {
      toast.error('Не удалось проверить статус. Попробуй позже.');
    } finally {
      setTracking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body selection:bg-primary/30">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="container flex items-center justify-between h-16">
          <button
            onClick={() => scrollTo('home')}
            className="flex items-center gap-2 group"
          >
            <div className="h-9 w-9 clip-badge bg-gradient-to-b from-primary to-secondary flex items-center justify-center">
              <Icon name="Crown" size={18} className="text-background" />
            </div>
            <span className="font-display font-700 text-lg tracking-wide">
              HERO <span className="text-gold-gradient">RUSSIA</span>
            </span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {n.label}
              </button>
            ))}
          </nav>
          <Button
            onClick={() => scrollTo('apply')}
            className="font-display uppercase tracking-wider font-600"
          >
            Стать модером
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      >
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-2xl">
            <div className="animate-float-up inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 mb-6">
              <Icon name="Sparkles" size={14} className="text-primary" />
              <span className="text-xs font-medium tracking-wide text-primary">
                Набор в команду открыт
              </span>
            </div>
            <h1
              className="animate-float-up font-display font-700 uppercase leading-[0.95] text-5xl sm:text-6xl lg:text-7xl mb-6"
              style={{ animationDelay: '0.1s' }}
            >
              Стань
              <br />
              <span className="text-gold-gradient">модератором</span>
              <br />
              HERO RUSSIA
            </h1>
            <p
              className="animate-float-up text-lg text-muted-foreground max-w-xl mb-8"
              style={{ animationDelay: '0.2s' }}
            >
              Держи порядок на легендарном сервере, помогай игрокам и стань
              частью элитной команды. Подай заявку и следи за её статусом в
              реальном времени.
            </p>
            <div
              className="animate-float-up flex flex-wrap gap-4"
              style={{ animationDelay: '0.3s' }}
            >
              <Button
                size="lg"
                onClick={() => scrollTo('apply')}
                className="font-display uppercase tracking-wider font-600 gold-glow"
              >
                <Icon name="Send" size={18} />
                Подать заявку
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo('status')}
                className="font-display uppercase tracking-wider font-600 border-primary/40"
              >
                <Icon name="Radar" size={18} />
                Проверить статус
              </Button>
            </div>

            <div
              className="animate-float-up mt-14 grid grid-cols-3 gap-6 max-w-md"
              style={{ animationDelay: '0.4s' }}
            >
              {[
                { n: '12K+', l: 'Игроков' },
                { n: '38', l: 'Модераторов' },
                { n: '24/7', l: 'Онлайн' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display font-700 text-3xl text-gold-gradient">
                    {s.n}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* APPLY */}
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
              <Icon name={submitting ? 'Loader2' : 'Send'} size={18} className={submitting ? 'animate-spin' : ''} />
              {submitting ? 'Отправляем...' : 'Отправить заявку'}
            </Button>
          </form>
        </div>
      </section>

      {/* STATUS */}
      <section
        id="status"
        className="relative py-24 border-t border-border/40 bg-muted/20"
      >
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <SectionTitle icon="Radar" kicker="Трекинг" center>
              Статус заявки
            </SectionTitle>
            <p className="text-muted-foreground">
              Введи свой игровой ник, чтобы узнать, на каком этапе твоя заявка.
            </p>
          </div>

          <form
            onSubmit={track}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-12"
          >
            <Input
              value={checkNick}
              onChange={(e) => setCheckNick(e.target.value)}
              placeholder="Твой игровой ник"
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={tracking}
              className="font-display uppercase tracking-wider font-600"
            >
              <Icon name={tracking ? 'Loader2' : 'Search'} size={18} className={tracking ? 'animate-spin' : ''} />
              Проверить
            </Button>
          </form>

          {tracked && (
            <div className="animate-float-up rounded-xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Icon name="User" size={20} className="text-primary" />
                </div>
                <div>
                  <div className="font-display font-600 text-lg">
                    {tracked.nick}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Заявка №{tracked.id}
                  </div>
                </div>
                <span
                  className={`ml-auto text-xs font-medium rounded-full px-3 py-1 border ${
                    tracked.status === 'rejected'
                      ? 'text-destructive bg-destructive/10 border-destructive/30'
                      : tracked.status === 'accepted'
                        ? 'text-primary bg-primary/10 border-primary/30'
                        : 'text-primary bg-primary/10 border-primary/30'
                  }`}
                >
                  {STATUS_MAP[tracked.status]?.label || tracked.status}
                </span>
              </div>

              <div className="relative">
                {STATUS_STEPS.map((s, i) => {
                  const currentStep = STATUS_MAP[tracked.status]?.step ?? 0;
                  const active = i <= currentStep;
                  const current = i === currentStep;
                  return (
                    <div
                      key={s.key}
                      className="flex gap-4 pb-8 last:pb-0 relative"
                    >
                      {i < STATUS_STEPS.length - 1 && (
                        <div
                          className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${
                            i < currentStep ? 'bg-primary' : 'bg-border'
                          }`}
                        />
                      )}
                      <div
                        className={`relative z-10 h-10 w-10 shrink-0 rounded-full flex items-center justify-center border-2 ${
                          active
                            ? 'bg-primary border-primary text-background'
                            : 'bg-card border-border text-muted-foreground'
                        } ${current ? 'gold-glow' : ''}`}
                      >
                        <Icon name={s.icon} size={18} />
                      </div>
                      <div className="pt-1.5">
                        <div
                          className={`font-display font-600 ${
                            active
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {s.label}
                        </div>
                        {current && (
                          <div className="text-xs text-primary mt-0.5">
                            Текущий этап
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-24 border-t border-border/40">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <SectionTitle icon="CircleHelp" kicker="FAQ" center>
              Вопросы и ответы
            </SectionTitle>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-border bg-card px-5"
              >
                <AccordionTrigger className="font-display font-500 text-left hover:no-underline hover:text-primary">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 py-10">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 clip-badge bg-gradient-to-b from-primary to-secondary flex items-center justify-center">
              <Icon name="Crown" size={16} className="text-background" />
            </div>
            <span className="font-display font-600">
              HERO <span className="text-gold-gradient">RUSSIA</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HERO RUSSIA. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;