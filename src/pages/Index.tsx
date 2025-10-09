import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import QuoteCard from "@/components/QuoteCard";
import ActionButtons from "@/components/ActionButtons";
import CategorySelector, { QuoteCategory } from "@/components/CategorySelector";
import AdBanner from "@/components/AdBanner";
import CreateQuoteModal from "@/components/CreateQuoteModal";
import { getRandomQuote, type Quote } from "@/lib/quotes";
import { generateQuoteImage } from "@/lib/imageGenerator";

const Index = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(getRandomQuote());
  const [category, setCategory] = useState<QuoteCategory>("aleatoria");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkIfFavorited();
  }, [currentQuote]);

  const checkIfFavorited = async () => {
    try {
      const { data, error } = await supabase
        .from('favorite_quotes')
        .select('id')
        .eq('quote_text', currentQuote.text)
        .maybeSingle();

      if (error) throw error;
      setIsFavorited(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const generateNewQuote = async () => {
    setIsGenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-quote', {
        body: { category }
      });

      if (response.error) throw response.error;

      const data = response.data;
      setCurrentQuote({
        text: data.frase,
        author: data.autor,
        category: category === "aleatoria" ? "Inspiracional" : category.charAt(0).toUpperCase() + category.slice(1)
      });

      toast({
        title: "Nova frase gerada!",
        description: "Aproveite sua nova inspiração do dia.",
      });
    } catch (error) {
      console.error('Error generating quote:', error);
      // Fallback to local quote
      const localQuote = getRandomQuote(currentQuote.text);
      setCurrentQuote(localQuote);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFavorite = async () => {
    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('favorite_quotes')
          .delete()
          .eq('quote_text', currentQuote.text);

        if (error) throw error;

        setIsFavorited(false);
        toast({
          title: "Removida dos favoritos",
          variant: "default",
        });
      } else {
        const { error } = await supabase
          .from('favorite_quotes')
          .insert({
            quote_text: currentQuote.text,
            author: currentQuote.author,
            category: currentQuote.category,
          });

        if (error) throw error;

        setIsFavorited(true);
        toast({
          title: "Adicionada aos favoritos!",
          description: "Você pode ver suas frases favoritas a qualquer momento.",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erro ao favoritar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      const imageUrl = await generateQuoteImage({
        text: currentQuote.text,
        author: currentQuote.author,
      });

      // Convert data URL to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'frase-do-dia.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Frase do Dia',
          text: `"${currentQuote.text}" — ${currentQuote.author}`,
          files: [file],
        });
        
        toast({
          title: "Compartilhado com sucesso!",
        });
      } else {
        // Fallback: download image
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'frase-do-dia.png';
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

  const handleCreateQuote = async (text: string, author: string, photoUrl?: string) => {
    try {
      const { error } = await supabase
        .from('user_quotes')
        .insert({
          quote_text: text,
          author: author,
          profile_photo_url: photoUrl,
        });

      if (error) throw error;

      // Generate and share image
      const imageUrl = await generateQuoteImage({
        text,
        author,
        profilePhotoUrl: photoUrl,
      });

      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'minha-frase.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Minha Frase',
          text: `"${text}" — ${author}`,
          files: [file],
        });
      } else {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'minha-frase.png';
        link.click();
      }

      toast({
        title: "Frase criada e compartilhada!",
        description: "Sua inspiração foi salva e compartilhada com sucesso.",
      });
    } catch (error) {
      console.error('Error creating quote:', error);
      toast({
        title: "Erro ao criar frase",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full py-6 px-4 border-b border-border">
        <div className="max-w-screen-lg mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Frases do Dia</h1>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
            onClick={() => window.location.href = '/favorites'}
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 py-12 gap-8">
        <div className="w-full max-w-screen-lg space-y-8">
          {/* Category Selector */}
          <CategorySelector value={category} onChange={setCategory} />

          {/* Quote Card */}
          <QuoteCard
            text={currentQuote.text}
            author={currentQuote.author}
            category={currentQuote.category}
          />

          {/* Action Buttons */}
          <ActionButtons
            onNewQuote={generateNewQuote}
            onFavorite={handleFavorite}
            onShare={handleShare}
            isFavorited={isFavorited}
            isGenerating={isGenerating}
          />

          {/* Create Quote Button */}
          <div className="flex justify-center pt-4">
            <Button
              variant="ghost"
              className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-5 w-5" />
              Criar Minha Frase
            </Button>
          </div>
        </div>
      </main>

      {/* Ad Banner */}
      <AdBanner />

      {/* Create Quote Modal */}
      <CreateQuoteModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateQuote={handleCreateQuote}
      />
    </div>
  );
};

export default Index;
