import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Share2, RefreshCw, Plus, Maximize2 } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import confetti from 'canvas-confetti';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import QuoteCard from "@/components/QuoteCard";
import CategorySelector, { QuoteCategory } from "@/components/CategorySelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import CreateQuoteModal from "@/components/CreateQuoteModal";
import ActionButtons from "@/components/ActionButtons";
import { supabase } from "@/integrations/supabase/client";
import { useQuoteHistory } from "@/hooks/useQuoteHistory";
import { useFavorites } from "@/hooks/useFavorites";
import { useUserQuotes } from "@/hooks/useUserQuotes";
import { useStreaks } from "@/hooks/useStreaks";
import { useOnboarding } from "@/hooks/useOnboarding";
import { generateQuoteImage } from "@/lib/imageGenerator";
import { getRandomQuote, type Quote } from "@/lib/quotes";
import AdBanner from "@/components/AdBanner";
import { InstallPrompt } from "@/components/InstallPrompt";
import { UpdatePrompt } from "@/components/UpdatePrompt";
import { QuoteLoadingState } from "@/components/QuoteLoadingState";
import { StatsCounter } from "@/components/StatsCounter";
import { OnboardingModal } from "@/components/OnboardingModal";
import { FocusMode } from "@/components/FocusMode";
import logo from "@/assets/logo.png";
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
  const { toast } = useToast();
  const { addToHistory, history } = useQuoteHistory();
  const { favorites, addFavorite, removeFavorite, isFavorited: checkIsFavorited, getFavoriteByText } = useFavorites();
  const { addUserQuote } = useUserQuotes();
  const { currentStreak, bestStreak } = useStreaks();
  const { showOnboarding, step, nextStep, completeOnboarding } = useOnboarding();
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [category, setCategory] = useState<QuoteCategory>("aleatoria");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // Load initial quote
  useEffect(() => {
    const loadInitialQuote = async () => {
      const quote = await getRandomQuote(history);
      setCurrentQuote(quote);
      addToHistory(quote.text);
    };
    loadInitialQuote();
  }, []);

  // Check if current quote is favorited
  useEffect(() => {
    if (currentQuote) {
      setIsFavorited(checkIsFavorited(currentQuote.text));
    }
  }, [currentQuote, favorites]);

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
    if (!currentQuote) return;

    // Haptic feedback on native
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light }).catch(console.error);
    }

    if (isFavorited) {
      const favorite = getFavoriteByText(currentQuote.text);
      if (favorite) {
        removeFavorite(favorite.id);
        setIsFavorited(false);
        toast({
          title: "💔 Removida dos favoritos",
          description: "Você pode adicionar novamente quando quiser",
        });
      }
    } else {
      addFavorite({
        quote_text: currentQuote.text,
        author: currentQuote.author,
        category: currentQuote.category,
      });
      setIsFavorited(true);
      
      // Confetti animation!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Check milestone
      const newFavoritesCount = favorites.length + 1;
      if (newFavoritesCount === 10) {
        toast({
          title: "🏆 Colecionador Nível 1!",
          description: "Você já tem 10 frases favoritas. Continue assim!",
          duration: 5000,
        });
      } else if (newFavoritesCount === 50) {
        toast({
          title: "🌟 Colecionador Master!",
          description: "Incrível! 50 frases favoritas! Você é inspirador!",
          duration: 5000,
        });
      } else {
        toast({
          title: "❤️ Adicionada com amor!",
          description: "Esta frase agora faz parte da sua coleção especial",
        });
      }
    }
  };

  const handleShare = async () => {
    if (!currentQuote) return;
    
    try {
      const imageUrl = await generateQuoteImage({
        text: currentQuote.text,
        author: currentQuote.author,
      });

      // Use native Share API if available (Capacitor)
      if (Capacitor.isNativePlatform()) {
        await Share.share({
          title: 'Frase do Dia',
          text: `"${currentQuote.text}" — ${currentQuote.author}`,
          url: imageUrl,
          dialogTitle: 'Compartilhar Frase',
        });
        
        toast({
          title: "🎉 Inspiração compartilhada!",
          description: "Você acabou de iluminar o dia de alguém",
        });
        return;
      }

      // Web fallback
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
          title: "🎉 Inspiração compartilhada!",
          description: "Você acabou de iluminar o dia de alguém",
        });
      } else {
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

      // Save to localStorage
      addUserQuote(text, author, photoUrl);

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
        title: "Frase criada e compartilhada! 🎉",
        description: "Sua inspiração foi salva com sucesso.",
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
      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal 
          step={step} 
          onNext={nextStep}
          onComplete={completeOnboarding}
        />
      )}
      
      {/* Focus Mode */}
      {focusMode && currentQuote && (
        <FocusMode 
          text={currentQuote.text}
          author={currentQuote.author}
          onClose={() => setFocusMode(false)}
        />
      )}
      
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
      
      {/* Streaks Display - Top Center */}
      {currentStreak > 0 && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-30 pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-2 backdrop-blur-md bg-background/60 rounded-full px-4 py-2 shadow-lg border border-border/50 animate-fade-in">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-xs text-muted-foreground leading-none">Streak</p>
              <p className="text-sm font-bold text-primary leading-none mt-0.5">{currentStreak} dias</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Actions - Top Right */}
      <div className="fixed top-0 right-0 z-30 pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))]">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 backdrop-blur-md bg-background/60 border border-border/50 shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-95 relative"
            onClick={() => navigate('/favorites')}
            aria-label="Ver favoritos"
          >
            <Heart className={`h-5 w-5 ${favorites.length > 0 ? 'fill-primary text-primary' : ''}`} />
            {favorites.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {favorites.length}
              </Badge>
            )}
          </Button>
          <div className="backdrop-blur-md bg-background/60 rounded-full shadow-lg border border-border/50">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 pt-20 sm:pt-24 pb-8 sm:pb-12 gap-6 sm:gap-8">
        <div className="w-full max-w-screen-lg space-y-6 sm:space-y-8">
          {/* Stats Counter */}
          <StatsCounter />
          
          {/* Category Selector */}
          <CategorySelector value={category} onChange={setCategory} />

          {/* Quote Card */}
          {isGenerating || !currentQuote ? (
            <QuoteLoadingState />
          ) : (
            <div className="relative">
              <QuoteCard
                text={currentQuote.text}
                author={currentQuote.author}
                category={currentQuote.category}
              />
              
              {/* Focus Mode Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                onClick={() => setFocusMode(true)}
                aria-label="Modo foco"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
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
