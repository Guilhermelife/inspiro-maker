import { useEffect, useState } from 'react';

const loadingMessages = [
  "Buscando sabedoria...",
  "Encontrando inspiração...",
  "Preparando sua dose diária...",
  "Carregando motivação...",
  "Selecionando as melhores palavras...",
];

export const QuoteLoadingState = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-12 text-center space-y-6 animate-fade-in">
      <div className="inline-block">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="absolute inset-0 flex items-center justify-center text-3xl">
            ✨
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-lg font-medium text-foreground animate-pulse">
          {loadingMessages[messageIndex]}
        </p>
        <p className="text-sm text-muted-foreground">
          Preparando sua inspiração...
        </p>
      </div>
    </div>
  );
};
