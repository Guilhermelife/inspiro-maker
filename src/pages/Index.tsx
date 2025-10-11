import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import logo from "@/assets/logo.png";
import { InstallPrompt } from "@/components/InstallPrompt";
import { UpdatePrompt } from "@/components/UpdatePrompt";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useQuoteHistory } from "@/hooks/useQuoteHistory";
import { z } from "zod";

const quoteInputSchema = z.object({
  quote_text: z.string()
    .trim()
    .min(10, "Frase muito curta (mínimo 10 caracteres)")
    .max(280, "Frase muito longa (máximo 280 caracteres)")
    .refine(val => !/<script|javascript:/i.test(val), "Conteúdo inválido detectado"),
  author: z.string()
    .trim()
    .min(2, "Nome do autor muito curto")
    .max(50, "Nome do autor muito longo"),
  profile_photo_url: z.string().url().optional().or(z.literal("")),
});

const Index = () => {
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [category, setCategory] = useState<QuoteCategory>("aleatoria");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const { history, addToHistory } = useQuoteHistory();

  // Load initial quote
  useEffect(() => {
    const loadInitialQuote = async () => {
      const quote = await getRandomQuote(history);
      setCurrentQuote(quote);
      addToHistory(quote.text);
    };
    loadInitialQuote();
  }, []);

  useEffect(() => {
    if (currentQuote) {
      checkIfFavorited();
    }
  }, [currentQuote]);

  const checkIfFavorited = async () => {
    if (!currentQuote) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsFavorited(false);
        return;
      }

      const { data, error } = await supabase
        .from('favorite_quotes')
        .select('id')
        .eq('quote_text', currentQuote.text)
        .eq('user_id', user.id)
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
        body: { 
          category,
          excludeTexts: history 
        }
      });

      if (response.error) throw response.error;

      const data = response.data;
      const newQuote = {
        text: data.frase,
        author: data.autor,
        category: category === "aleatoria" ? "Inspiracional" : category.charAt(0).toUpperCase() + category.slice(1)
      };
      
      setCurrentQuote(newQuote);
      addToHistory(newQuote.text);

      toast({
        title: category === "motivacao-reversa" ? "💥 Motivação Reversa ativada!" : "Nova frase gerada!",
        description: category === "motivacao-reversa" ? "Prepare-se para a realidade crua." : "Aproveite sua nova inspiração do dia.",
      });
    } catch (error) {
      console.error('Error generating quote:', error);
      // Fallback to local quote
      const localQuote = await getRandomQuote(history);
      setCurrentQuote(localQuote);
      addToHistory(localQuote.text);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Login necessário",
          description: "Você precisa estar logado para salvar favoritos.",
          variant: "destructive",
        });
        return;
      }

      if (isFavorited) {
        const { error } = await supabase
          .from('favorite_quotes')
          .delete()
          .eq('quote_text', currentQuote!.text)
          .eq('user_id', user.id);

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
            quote_text: currentQuote!.text,
            author: currentQuote!.author,
            category: currentQuote!.category,
            user_id: user.id,
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
        text: currentQuote!.text,
        author: currentQuote!.author,
      });

      // Convert data URL to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'frase-do-dia.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Frase do Dia',
          text: `"${currentQuote!.text}" — ${currentQuote!.author}`,
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Login necessário",
          description: "Você precisa estar logado para criar frases.",
          variant: "destructive",
        });
        return;
      }

      // Validate inputs
      const validationResult = quoteInputSchema.safeParse({
        quote_text: text,
        author: author,
        profile_photo_url: photoUrl || "",
      });

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast({
          title: "Entrada inválida",
          description: firstError.message,
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('user_quotes')
        .insert({
          quote_text: text,
          author: author,
          profile_photo_url: photoUrl || null,
          user_id: user.id,
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
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--gradient-subtle)' }}>
      {/* Floating Logo - Top Left */}
      <div className="fixed top-0 left-0 z-30 pt-[max(1rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))]">
        <div className="backdrop-blur-md bg-background/60 rounded-full p-2 shadow-lg border border-border/50">
          <img 
            src={logo} 
            alt="Frases do Dia" 
            className="h-8 w-auto"
          />
        </div>
      </div>

      {/* Floating Actions - Top Right */}
      <div className="fixed top-0 right-0 z-30 pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))]">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 backdrop-blur-md bg-background/60 border border-border/50 shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-95"
            onClick={() => navigate('/favorites')}
            aria-label="Ver favoritos"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <div className="backdrop-blur-md bg-background/60 rounded-full shadow-lg border border-border/50">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 pt-20 sm:pt-24 pb-8 sm:pb-12 gap-6 sm:gap-8">
        <div className="w-full max-w-screen-lg space-y-6 sm:space-y-8">
          {/* Category Selector */}
          <CategorySelector value={category} onChange={setCategory} />

          {/* Quote Card */}
          {isGenerating || !currentQuote ? (
            <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 md:p-12">
              <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-32 w-full max-w-xl" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
          ) : (
            <QuoteCard
              text={currentQuote.text}
              author={currentQuote.author}
              category={currentQuote.category}
            />
          )}

          {/* Action Buttons */}
          <ActionButtons
            onNewQuote={generateNewQuote}
            onFavorite={handleFavorite}
            onShare={handleShare}
            isFavorited={isFavorited}
            isGenerating={isGenerating}
          />

          {/* Create Quote Button */}
          <div className="flex justify-center pt-2 sm:pt-4">
            <Button
              variant="outline"
              className="gap-2 h-11 px-6 border-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 transition-all duration-200"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Criar Minha Frase</span>
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
      
      {/* PWA Components */}
      <InstallPrompt />
      <UpdatePrompt />
    </div>
  );
};

export default Index;