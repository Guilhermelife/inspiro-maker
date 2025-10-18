import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface OnboardingModalProps {
  step: number;
  onNext: () => void;
  onComplete: () => void;
}

export const OnboardingModal = ({ step, onNext, onComplete }: OnboardingModalProps) => {
  const steps = [
    {
      title: 'Bem-vindo! 🎉',
      description: 'Receba frases inspiradoras todos os dias e transforme sua vida!',
      action: 'Começar Tour',
    },
    {
      title: 'Explore Categorias 📚',
      description: 'Escolha entre motivacionais, reflexivas, bíblicas e muito mais!',
      action: 'Próximo',
    },
    {
      title: 'Salve suas Favoritas 💝',
      description: 'Marque as frases que tocam seu coração e acesse quando quiser!',
      action: 'Próximo',
    },
    {
      title: 'Compartilhe Inspiração ✨',
      description: 'Compartilhe lindas imagens das frases com seus amigos!',
      action: 'Começar',
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fade-in p-4">
      <div className="bg-card p-8 rounded-2xl max-w-md text-center space-y-6 animate-scale-in border-2 border-primary/20 shadow-2xl relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={onComplete}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="text-6xl mb-4">
          {step === 0 ? '🎉' : step === 1 ? '📚' : step === 2 ? '💝' : '✨'}
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">{currentStep.title}</h2>
          <p className="text-muted-foreground">{currentStep.description}</p>
        </div>
        
        <div className="flex gap-2 justify-center">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-8 bg-primary' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>
        
        <Button 
          onClick={isLastStep ? onComplete : onNext} 
          size="lg"
          className="w-full"
        >
          {currentStep.action}
        </Button>
      </div>
    </div>
  );
};
