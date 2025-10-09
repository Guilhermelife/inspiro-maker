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
    <div className="flex items-center justify-center gap-2 sm:gap-3 w-full max-w-md mx-auto">
      <Button
        variant="outline"
        size="lg"
        className="flex-1 h-12 sm:h-14 gap-2 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 transition-all duration-200"
        onClick={onNewQuote}
        disabled={isGenerating}
        aria-label="Gerar nova frase"
      >
        <RefreshCw className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
        <span className="hidden xs:inline">Nova</span>
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        className={`flex-1 h-12 sm:h-14 gap-2 border-2 active:scale-95 transition-all duration-200 ${
          isFavorited
            ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
            : 'hover:bg-primary hover:text-primary-foreground hover:border-primary'
        }`}
        onClick={onFavorite}
        aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Heart className={`h-5 w-5 transition-transform ${isFavorited ? 'fill-current scale-110' : ''}`} />
        <span className="hidden xs:inline">{isFavorited ? 'Favoritada' : 'Favoritar'}</span>
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        className="flex-1 h-12 sm:h-14 gap-2 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 transition-all duration-200"
        onClick={onShare}
        aria-label="Compartilhar frase"
      >
        <Share2 className="h-5 w-5" />
        <span className="hidden xs:inline">Compartilhar</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
