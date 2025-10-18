import { Button } from "@/components/ui/button";
import { Heart, RefreshCw, Share2 } from "lucide-react";
import { useState } from "react";

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
  const [rippleNew, setRippleNew] = useState(false);
  const [rippleFav, setRippleFav] = useState(false);
  const [rippleShare, setRippleShare] = useState(false);

  const handleNewQuote = () => {
    setRippleNew(true);
    setTimeout(() => setRippleNew(false), 600);
    onNewQuote();
  };

  const handleFavorite = () => {
    setRippleFav(true);
    setTimeout(() => setRippleFav(false), 600);
    onFavorite();
  };

  const handleShare = () => {
    setRippleShare(true);
    setTimeout(() => setRippleShare(false), 600);
    onShare();
  };

  return (
    <div className="flex gap-3 w-full max-w-lg mx-auto">
      {/* Botão Nova Frase - Destaque */}
      <Button
        variant="default"
        size="lg"
        className="flex-1 h-14 gap-3 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
        onClick={handleNewQuote}
        disabled={isGenerating}
        aria-label="Gerar nova frase"
      >
        {rippleNew && (
          <span className="absolute inset-0 bg-white/30 rounded-md animate-ripple" />
        )}
        <RefreshCw className={`h-5 w-5 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
        <span className="font-semibold hidden xs:inline">Nova Inspiração</span>
        <span className="font-semibold xs:hidden">Nova</span>
      </Button>
      
      {/* Botão Favoritar - Emocional */}
      <Button
        variant={isFavorited ? "default" : "outline"}
        size="lg"
        className={`h-14 w-14 rounded-full transition-all duration-300 relative overflow-hidden ${
          isFavorited 
            ? 'bg-gradient-to-br from-pink-500 to-rose-500 hover:scale-110 shadow-lg shadow-pink-500/50 border-0' 
            : 'hover:scale-110 hover:border-pink-500 hover:text-pink-500 border-2'
        }`}
        onClick={handleFavorite}
        aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        {rippleFav && (
          <span className="absolute inset-0 bg-white/30 rounded-full animate-ripple" />
        )}
        <Heart className={`h-5 w-5 transition-all duration-300 ${isFavorited ? 'fill-current animate-pulse' : ''}`} />
      </Button>
      
      {/* Botão Compartilhar - Social */}
      <Button
        variant="outline"
        size="lg"
        className="h-14 w-14 rounded-full hover:bg-green-500 hover:text-white hover:border-green-500 hover:scale-110 transition-all duration-300 border-2 relative overflow-hidden"
        onClick={handleShare}
        aria-label="Compartilhar frase"
      >
        {rippleShare && (
          <span className="absolute inset-0 bg-white/30 rounded-full animate-ripple" />
        )}
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ActionButtons;
