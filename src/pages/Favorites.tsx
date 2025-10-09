import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2 } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full py-6 px-4 border-b border-border">
        <div className="max-w-screen-lg mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.href = '/'}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-primary">Favoritos</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-screen-lg mx-auto p-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Você ainda não tem frases favoritas.
            </p>
            <Button
              variant="link"
              className="mt-4"
              onClick={() => window.location.href = '/'}
            >
              Voltar para início
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="p-6 relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(favorite.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                
                {favorite.category && (
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-3">
                    {favorite.category}
                  </span>
                )}
                
                <blockquote className="text-lg font-medium leading-relaxed text-foreground mb-4">
                  "{favorite.quote_text}"
                </blockquote>
                
                <cite className="text-sm text-muted-foreground not-italic">
                  — {favorite.author}
                </cite>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
