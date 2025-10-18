import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface DailyQuote {
  text: string;
  author: string;
}

export const DailyQuoteBanner = () => {
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);

  useEffect(() => {
    // Check if we have a daily quote stored
    const storedQuote = localStorage.getItem('daily_quote');
    const storedDate = localStorage.getItem('daily_quote_date');
    const today = new Date().toDateString();

    if (storedQuote && storedDate === today) {
      setDailyQuote(JSON.parse(storedQuote));
    } else {
      // Generate a new daily quote (você pode puxar do Supabase aqui)
      const newDailyQuote = {
        text: "A persistência é o caminho do êxito.",
        author: "Charles Chaplin"
      };
      localStorage.setItem('daily_quote', JSON.stringify(newDailyQuote));
      localStorage.setItem('daily_quote_date', today);
      setDailyQuote(newDailyQuote);
    }
  }, []);

  if (!dailyQuote) return null;

  return (
    <div className="w-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-2 border-primary/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm animate-fade-in">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 animate-bounce-subtle">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold tracking-wide uppercase text-primary">
            Frase do Dia
          </h3>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <blockquote className="font-serif text-lg sm:text-xl md:text-2xl leading-relaxed px-4">
          "{dailyQuote.text}"
        </blockquote>
        <cite className="text-sm text-muted-foreground not-italic">
          — {dailyQuote.author}
        </cite>
      </div>
    </div>
  );
};
