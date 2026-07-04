export const APPLY_URL = 'https://functions.poehali.dev/b839d72f-e05c-44f4-b265-512fc311173d';

export const HERO_IMG =
  'https://cdn.poehali.dev/projects/0d7f3f74-dcb1-4374-adf9-9768dc0253a4/files/b41257e6-c3fe-4035-92d1-fc44aba4f4be.jpg';

export const NAV = [
  { id: 'home', label: 'Главная' },
  { id: 'apply', label: 'Подать заявку' },
  { id: 'status', label: 'Статус заявки' },
  { id: 'faq', label: 'Вопросы' },
];

export const FAQ = [
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

export const STATUS_STEPS = [
  { key: 'sent', label: 'Заявка получена', icon: 'Inbox' },
  { key: 'review', label: 'На рассмотрении', icon: 'ScanSearch' },
  { key: 'interview', label: 'Собеседование', icon: 'Mic' },
  { key: 'done', label: 'Решение принято', icon: 'ShieldCheck' },
];

export const STATUS_MAP: Record<string, { step: number; label: string }> = {
  sent: { step: 0, label: 'Заявка получена' },
  review: { step: 1, label: 'На рассмотрении' },
  interview: { step: 2, label: 'Собеседование' },
  accepted: { step: 3, label: 'Принят' },
  rejected: { step: 3, label: 'Отклонено' },
};

export const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};
