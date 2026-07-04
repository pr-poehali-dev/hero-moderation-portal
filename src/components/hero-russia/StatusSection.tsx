import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { SectionTitle } from './Shared';
import { APPLY_URL, STATUS_STEPS, STATUS_MAP } from './constants';

const StatusSection = () => {
  const [checkNick, setCheckNick] = useState('');
  const [tracked, setTracked] = useState<null | {
    id: number;
    nick: string;
    status: string;
  }>(null);
  const [tracking, setTracking] = useState(false);

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
            <Icon
              name={tracking ? 'Loader2' : 'Search'}
              size={18}
              className={tracking ? 'animate-spin' : ''}
            />
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
                          active ? 'text-foreground' : 'text-muted-foreground'
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
  );
};

export default StatusSection;
