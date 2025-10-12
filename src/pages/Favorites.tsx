import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { generateQuoteImage } from "@/lib/imageGenerator";
import { useFavorites } from "@/hooks/useFavorites";

const Favorites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { favorites, removeFavorite } = useFavorites();

  const handleDelete = (id: string) => {
    removeFavorite(id);
    toast({
      title: "Frase removida",
      description: "A frase foi removida dos seus favoritos",
    });
  };

  const handleShare = async (favorite: { quote_text: string; author: string }) => {
    try {
      const imageUrl = await generateQuoteImage({
        text: favorite.quote_text,
        author: favorite.author,
      });

      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'frase-favorita.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Frase do Dia',
          text: `"${favorite.quote_text}" — ${favorite.author}`,
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
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              Nenhuma frase favorita ainda
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-6">
              Comece a adicionar suas frases favoritas na página inicial! ❤️
            </p>
            <Button
              variant="outline"
              className="gap-2 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 transition-all"
              onClick={() => navigate('/')}
            >
              Explorar Frases
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
    </div>
  );
};

export default Favorites;
