import { Card } from "@/components/ui/card";

interface QuoteCardProps {
  text: string;
  author: string;
  category?: string;
}

const QuoteCard = ({ text, author, category }: QuoteCardProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto p-8 md:p-12 shadow-lg border-0 bg-card animate-fade-in">
      <div className="flex flex-col items-center text-center space-y-6">
        {category && (
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {category}
          </span>
        )}
        <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed text-foreground">
          "{text}"
        </blockquote>
        <cite className="text-sm md:text-base text-muted-foreground not-italic">
          — {author}
        </cite>
      </div>
    </Card>
  );
};

export default QuoteCard;
