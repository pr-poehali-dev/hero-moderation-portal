import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { NAV, HERO_IMG, scrollTo } from './constants';

const HeroHeader = () => {
  return (
    <>
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
    </>
  );
};

export default HeroHeader;
