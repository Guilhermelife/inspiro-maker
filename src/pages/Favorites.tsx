import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { generateQuoteImage, ImageFormat } from "@/lib/imageGenerator";
import { ShareFormatSelector } from "@/components/ShareFormatSelector";
import { useFavorites } from "@/hooks/useFavorites";

const Favorites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { favorites, removeFavorite } = useFavorites();
  const [isFormatSelectorOpen, setIsFormatSelectorOpen] = useState(false);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState<{ quote_text: string; author: string; category?: string } | null>(null);

  const handleDelete = (id: string) => {
    removeFavorite(id);
    toast({
      title: "Frase removida",
      description: "A frase foi removida dos seus favoritos",
    });
  };

  const handleShare = (favorite: { quote_text: string; author: string; category?: string }) => {
    setSelectedFavorite(favorite);
    setIsFormatSelectorOpen(true);
  };

  const handleShareWithFormat = async (format: ImageFormat) => {
    if (!selectedFavorite) return;
    
    setIsFormatSelectorOpen(false);
    setIsGeneratingShare(true);
    
    try {
      const imageUrl = await generateQuoteImage({
        text: selectedFavorite.quote_text,
        author: selectedFavorite.author,
        category: selectedFavorite.category,
        format,
      });

      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'frase-favorita.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Frase do Dia',
          text: `"${selectedFavorite.quote_text}" — ${selectedFavorite.author}`,
          files: [file],
        });
        
        toast({
          title: "Compartilhado com sucesso!",
        });
      } else {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'frase-favorita.png';
        link.click();
        
        toast({
          title: "Imagem baixada!",
          description: "Compartilhe manualmente nas suas redes sociais.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Erro ao compartilhar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const handleDownloadWithFormat = async (format: ImageFormat) => {
    if (!selectedFavorite) return;
    
    setIsFormatSelectorOpen(false);
    setIsGeneratingShare(true);

    try {
      const imageDataUrl = await generateQuoteImage({
        text: selectedFavorite.quote_text,
        author: selectedFavorite.author,
        category: selectedFavorite.category,
        format,
      });

      const link = document.createElement('a');
      link.download = `frase-${format}-${Date.now()}.png`;
      link.href = imageDataUrl;
      link.click();

      toast({
        title: "Download iniciado!",
        description: "A imagem foi baixada com sucesso.",
      });
    } catch (error) {
      console.error('Error downloading:', error);
      toast({
        title: "Erro ao baixar",
        description: "Não foi possível baixar a imagem.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingShare(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-subtle)' }}>
      {/* Floating Back Button - Top Left */}
      <div className="fixed top-0 left-0 z-30 pt-[max(1rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))]">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 backdrop-blur-md bg-background/60 border border-border/50 shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-95"
          onClick={() => navigate('/')}
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Theme Toggle - Top Right */}
      <div className="fixed top-0 right-0 z-30 pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))]">
        <div className="backdrop-blur-md bg-background/60 rounded-full shadow-lg border border-border/50">
          <ThemeToggle />
        </div>
      </div>

      {/* Page Title - Centered below floating buttons */}
      <div className="pt-20 pb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Minhas Favoritas</h1>
      </div>

      {/* Content */}
      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 px-4 animate-fade-in">
            {/* Ilustração com emoji e decoração */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-bounce-subtle">
                <span className="text-6xl">💝</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-xl">+</span>
              </div>
            </div>
            
            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-bold text-foreground">
                Suas frases favoritas aparecerão aqui
              </h2>
              <p className="text-muted-foreground">
                Comece a colecionar frases que tocam seu coração e inspire-se sempre que precisar!
              </p>
            </div>
            
            <Button
              size="lg"
              className="gap-2 h-12 px-8 shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate('/')}
            >
              <Heart className="h-5 w-5" />
              Descobrir Frases
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => (
              <Card 
                key={favorite.id} 
                className="p-6 relative group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 animate-fade-in"
              >
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                    onClick={() => handleShare(favorite)}
                    aria-label="Compartilhar frase"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-all active:scale-90"
                    onClick={() => handleDelete(favorite.id)}
                    aria-label="Remover favorito"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3 sm:space-y-4 pr-8">
                  {favorite.category && (
                    <span className="text-xs tracking-wide text-muted-foreground font-medium px-2 py-1 rounded-full bg-secondary/50 inline-block">
                      {favorite.category}
                    </span>
                  )}
                  <blockquote className="text-base sm:text-lg font-medium text-foreground" style={{ lineHeight: '1.6' }}>
                    "{favorite.quote_text}"
                  </blockquote>
                  <cite className="text-sm text-muted-foreground not-italic font-medium">
                    — {favorite.author}
                  </cite>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <ShareFormatSelector
        open={isFormatSelectorOpen}
        onOpenChange={setIsFormatSelectorOpen}
        onFormatSelect={handleShareWithFormat}
        onDownload={handleDownloadWithFormat}
        isGenerating={isGeneratingShare}
      />
    </div>
  );
};

export default Favorites;
