import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FocusModeProps {
  text: string;
  author: string;
  onClose: () => void;
}

export const FocusMode = ({ text, author, onClose }: FocusModeProps) => {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-8 animate-fade-in">
      <div className="max-w-4xl text-center space-y-8">
        <blockquote className="font-serif text-4xl md:text-5xl lg:text-6xl leading-relaxed text-foreground">
          "{text}"
        </blockquote>
        <cite className="text-xl md:text-2xl text-muted-foreground not-italic">
          — {author}
        </cite>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 h-12 w-12 rounded-full backdrop-blur-md bg-background/60 hover:bg-primary hover:text-primary-foreground"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};
