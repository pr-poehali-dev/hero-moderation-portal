import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const ADMIN_URL = 'https://functions.poehali.dev/16cec6c3-30f5-4161-9a8d-3a8bc1ec98e9';

type Application = {
  id: number;
  nick: string;
  age: number;
  phone: string;
  online_hours: string;
  vk: string;
  about: string;
  status: string;
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  sent: 'Заявка получена',
  review: 'На рассмотрении',
  interview: 'Собеседование',
  accepted: 'Принят',
  rejected: 'Отклонено',
};

const STATUS_COLORS: Record<string, string> = {
  sent: 'text-muted-foreground bg-muted border-border',
  review: 'text-primary bg-primary/10 border-primary/30',
  interview: 'text-primary bg-primary/10 border-primary/30',
  accepted: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  rejected: 'text-destructive bg-destructive/10 border-destructive/30',
};

const Admin = () => {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState<Application[]>([]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(ADMIN_URL, {
        headers: { 'X-Admin-Password': password },
      });
      if (res.status === 401) {
        toast.error('Неверный пароль');
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setApps(data);
      setAuthed(true);
    } catch {
      toast.error('Не удалось загрузить заявки');
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    const res = await fetch(ADMIN_URL, {
      headers: { 'X-Admin-Password': password },
    });
    if (res.ok) setApps(await res.json());
  };

  const changeStatus = async (id: number, status: string) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    try {
      const res = await fetch(ADMIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': password,
        },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      toast.success('Статус обновлён');
    } catch {
      toast.error('Не удалось обновить статус');
      refresh();
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-body px-4">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-xl border border-border bg-card p-8 space-y-5"
        >
          <div className="flex items-center gap-2 justify-center mb-2">
            <div className="h-9 w-9 clip-badge bg-gradient-to-b from-primary to-secondary flex items-center justify-center">
              <Icon name="ShieldCheck" size={18} className="text-background" />
            </div>
            <span className="font-display font-700 text-lg tracking-wide">
              Панель <span className="text-gold-gradient">заявок</span>
            </span>
          </div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль администратора"
            autoFocus
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full font-display uppercase tracking-wider font-600"
          >
            <Icon name={loading ? 'Loader2' : 'LogIn'} size={18} className={loading ? 'animate-spin' : ''} />
            Войти
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="border-b border-border/60 sticky top-0 bg-background/90 backdrop-blur-md z-10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 clip-badge bg-gradient-to-b from-primary to-secondary flex items-center justify-center">
              <Icon name="ShieldCheck" size={18} className="text-background" />
            </div>
            <span className="font-display font-700 text-lg tracking-wide">
              Заявки <span className="text-gold-gradient">HERO RUSSIA</span>
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={refresh}>
            <Icon name="RefreshCw" size={16} />
            Обновить
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-6 text-sm text-muted-foreground">
          Всего заявок: <span className="text-foreground font-medium">{apps.length}</span>
        </div>

        <div className="space-y-4">
          {apps.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-border bg-card p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-600 text-lg">
                      {a.nick}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      #{a.id}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {new Date(a.created_at).toLocaleString('ru-RU')}
                  </div>
                </div>
                <span
                  className={`text-xs font-medium rounded-full px-3 py-1 border ${STATUS_COLORS[a.status] || ''}`}
                >
                  {STATUS_LABELS[a.status] || a.status}
                </span>
              </div>

              <div className="grid sm:grid-cols-4 gap-3 mb-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Возраст</div>
                  <div>{a.age}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Телефон</div>
                  <div>{a.phone || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Игровой уровень</div>
                  <div>{a.online_hours || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">ВК ID</div>
                  <div>{a.vk || '—'}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-muted-foreground mb-1">
                  Почему именно он
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                  {a.about}
                </p>
              </div>

              <Select
                value={a.status}
                onValueChange={(v) => changeStatus(a.id, v)}
              >
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          {apps.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              Заявок пока нет
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;