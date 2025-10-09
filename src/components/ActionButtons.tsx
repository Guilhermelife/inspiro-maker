import { Button } from "@/components/ui/button";
import { Heart, RefreshCw, Share2 } from "lucide-react";

interface ActionButtonsProps {
  onNewQuote: () => void;
  onFavorite: () => void;
  onShare: () => void;
  isFavorited: boolean;
  isGenerating?: boolean;
}

const ActionButtons = ({
  onNewQuote,
  onFavorite,
  onShare,
  isFavorited,
  isGenerating = false,
}: ActionButtonsProps) => {
  return (
    <div className="flex items-center justify-center gap-4 w-full max-w-md mx-auto">
      <Button
        variant="outline"
        size="lg"
        className="flex-1 h-14 gap-2 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
        onClick={onNewQuote}
        disabled={isGenerating}
      >
        <RefreshCw className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
        Nova
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        className={`flex-1 h-14 gap-2 border-2 transition-all ${
          isFavorited
            ? 'bg-primary text-primary-foreground border-primary'
            : 'hover:bg-primary hover:text-primary-foreground hover:border-primary'
        }`}
        onClick={onFavorite}
      >
        <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
        {isFavorited ? 'Favoritada' : 'Favoritar'}
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        className="flex-1 h-14 gap-2 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
        onClick={onShare}
      >
        <Share2 className="h-5 w-5" />
        Compartilhar
      </Button>
    </div>
  );
};

export default ActionButtons;
