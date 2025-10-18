import { Button } from '@/components/ui/button';
import { X, Heart, RefreshCw, Share2, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface OnboardingModalProps {
  step: number;
  onNext: () => void;
  onComplete: () => void;
}

export const OnboardingModal = ({ step, onNext, onComplete }: OnboardingModalProps) => {
  const steps = [
    {
      title: "Bem-vindo! 🎉",
      description: "Receba frases inspiradoras todos os dias e transforme sua vida com mensagens que tocam o coração.",
      icon: Sparkles,
      color: "text-primary",
    },
    {
      title: "Nova Inspiração",
      description: "Clique no botão 'Nova Inspiração' para gerar frases personalizadas para você de diferentes categorias.",
      icon: RefreshCw,
      color: "text-blue-500",
    },
    {
      title: "Favorite suas Frases ❤️",
      description: "Toque no coração para salvar suas frases favoritas e criar sua coleção pessoal de inspiração.",
      icon: Heart,
      color: "text-pink-500",
    },
    {
      title: "Compartilhe a Inspiração",
      description: "Use o botão de compartilhar para inspirar seus amigos e familiares nas redes sociais!",
      icon: Share2,
      color: "text-green-500",
    },
  ];

  const currentStep = steps[step] || steps[0];
  const Icon = currentStep.icon;
  const isLastStep = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fade-in p-4">
      <div className="bg-card p-8 rounded-2xl max-w-md text-center space-y-6 animate-scale-in border-2 border-primary/20 shadow-2xl relative">
        <button
          onClick={onComplete}
          className="absolute -top-2 -right-2 p-2 rounded-full hover:bg-accent transition-colors z-10"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
        
        {/* Progress bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center mt-2">
            Passo {step + 1} de {steps.length}
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center space-y-6 py-4">
          {/* Icon with spotlight effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className={`relative p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full border-2 border-primary/20 animate-scale-in ${currentStep.color}`}>
              <Icon className="h-12 w-12" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold animate-fade-in">{currentStep.title}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Navigation dots */}
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === step ? 'w-8 bg-primary' : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={isLastStep ? onComplete : onNext}
            size="lg"
            className="w-full gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            {isLastStep ? (
              <>
                <Sparkles className="h-5 w-5" />
                Começar Jornada!
              </>
            ) : (
              'Próximo →'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
