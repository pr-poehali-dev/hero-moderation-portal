import Icon from '@/components/ui/icon';
import { Label } from '@/components/ui/label';

export const Field = ({
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

export const SectionTitle = ({
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
