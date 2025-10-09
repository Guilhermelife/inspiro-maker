import { Card } from "@/components/ui/card";

interface QuoteCardProps {
  text: string;
  author: string;
  category?: string;
}

const QuoteCard = ({ text, author, category }: QuoteCardProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto p-6 sm:p-8 md:p-12 border-0 bg-card animate-fade-in transition-all duration-300" style={{ boxShadow: 'var(--shadow-elegant)' }}>
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
        {category && (
          <span className="text-xs sm:text-sm tracking-wide text-muted-foreground font-medium px-3 py-1 rounded-full bg-secondary/50">
            {category}
          </span>
        )}
        <blockquote className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground max-w-xl" style={{ lineHeight: '1.6' }}>
          "{text}"
        </blockquote>
        <cite className="text-sm sm:text-base text-muted-foreground not-italic font-medium">
          — {author}
        </cite>
      </div>
    </Card>
  );
};

export default QuoteCard;
