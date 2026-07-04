import HeroHeader from '@/components/hero-russia/HeroHeader';
import ApplySection from '@/components/hero-russia/ApplySection';
import StatusSection from '@/components/hero-russia/StatusSection';
import FaqSection from '@/components/hero-russia/FaqSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-body selection:bg-primary/30">
      <HeroHeader />
      <ApplySection />
      <StatusSection />
      <FaqSection />
    </div>
  );
};

export default Index;
