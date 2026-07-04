import Icon from '@/components/ui/icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SectionTitle } from './Shared';
import { FAQ } from './constants';

const FaqSection = () => {
  return (
    <>
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
    </>
  );
};

export default FaqSection;
