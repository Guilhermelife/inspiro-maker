import { Card } from "@/components/ui/card";
import { categoryThemes, CategoryKey } from "@/lib/categoryThemes";

interface QuoteCardProps {
  text: string;
  author: string;
  category?: string;
}

const QuoteCard = ({ text, author, category }: QuoteCardProps) => {
  const theme = category ? categoryThemes[category as CategoryKey] : null;
  
  return (
    <Card className="group relative overflow-hidden w-full max-w-2xl mx-auto border-2 hover:border-primary/20 transition-all duration-500 animate-fade-in" style={{ boxShadow: 'var(--shadow-elegant)' }}>
      {/* Gradiente de fundo baseado na categoria */}
      {theme && (
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      )}
      
      {/* Aspas decorativas */}
      <div className="absolute top-4 left-4 text-6xl sm:text-7xl text-primary/10 font-serif leading-none select-none">"</div>
      <div className="absolute bottom-4 right-4 text-6xl sm:text-7xl text-primary/10 font-serif leading-none select-none">"</div>
      
      <div className="relative z-10 p-8 sm:p-10 md:p-12">
        {/* Badge com ícone */}
        {category && theme && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl">{theme.icon}</span>
            <span className={`text-xs font-semibold tracking-widest uppercase ${theme.color}`}>
              {category}
            </span>
          </div>
        )}
        
        {/* Frase com fonte serif elegante */}
        <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl leading-relaxed mb-6 text-foreground">
          {text}
        </blockquote>
        
        {/* Autor com divider decorativo */}
        <div className="flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-border" />
          <cite className="text-sm font-medium tracking-wide text-muted-foreground not-italic">
            {author}
          </cite>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-border" />
        </div>
      </div>
    </Card>
  );
};

export default QuoteCard;
