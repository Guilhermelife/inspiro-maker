import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Trash2, Heart, Share2 } from "lucide-react";
import { generateQuoteImage } from "@/lib/imageGenerator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FavoriteQuote {
  id: string;
  quote_text: string;
  author: string;
  category?: string;
  created_at: string;
}

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorite_quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast({
        title: "Erro ao carregar favoritos",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('favorite_quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFavorites(favorites.filter(fav => fav.id !== id));
      toast({
        title: "Frase removida",
        description: "A frase foi removida dos seus favoritos.",
      });
    } catch (error) {
      console.error('Error deleting favorite:', error);
      toast({
        title: "Erro ao remover",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (favorite: FavoriteQuote) => {
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
      {/* Header */}
      <header className="w-full py-4 sm:py-6 px-4 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-screen-lg mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 active:scale-95 transition-all"
            onClick={() => navigate('/')}
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-primary">Minhas Favoritas</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-screen-lg mx-auto p-4 sm:p-6 py-6 sm:py-8">
        {isLoading ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 rounded-lg bg-card border animate-pulse">
                <Skeleton className="h-4 w-20 mb-4" />
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              Nenhuma frase favorita ainda
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-6">
              Favorite as frases que mais te inspiram para vê-las aqui a qualquer momento.
            </p>
            <Button
              variant="outline"
              className="gap-2 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 transition-all"
              onClick={() => navigate('/')}
            >
              Voltar para início
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
