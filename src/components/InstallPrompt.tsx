import { useState } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const InstallPrompt = () => {
  const { isInstallable, isIOS, isInstalled, promptInstall } = usePWAInstall();
  const [showBanner, setShowBanner] = useState(true);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // Não mostrar se já instalado ou se usuário fechou
  if (isInstalled || !showBanner) return null;

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else if (isInstallable) {
      const installed = await promptInstall();
      if (installed) {
        setShowBanner(false);
      }
    }
  };

  return (
    <>
      {/* Banner de Instalação Premium */}
      {(isInstallable || isIOS) && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 max-w-md w-[calc(100%-2rem)] animate-slide-up">
          <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-2xl shadow-2xl border-2 border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              
              <div className="flex-1 text-white">
                <p className="font-bold text-sm">Instalar App</p>
                <p className="text-xs opacity-90">Acesso rápido e offline</p>
              </div>
              
              <Button
                size="sm"
                className="bg-white text-primary hover:bg-white/90 font-bold"
                onClick={handleInstall}
              >
                Instalar
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-white/20 flex-shrink-0"
                onClick={() => setShowBanner(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal com Instruções iOS */}
      <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Instalar no iOS/Safari</DialogTitle>
            <DialogDescription>
              Siga estes passos para adicionar à tela inicial:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex gap-3 items-start">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                1
              </div>
              <p className="text-sm pt-1">
                Toque no botão <strong>"Compartilhar"</strong> (ícone de quadrado com seta) na barra inferior do Safari
              </p>
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                2
              </div>
              <p className="text-sm pt-1">
                Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>
              </p>
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                3
              </div>
              <p className="text-sm pt-1">
                Toque em <strong>"Adicionar"</strong> no canto superior direito
              </p>
            </div>
          </div>
          
          <Button onClick={() => setShowIOSInstructions(false)}>
            Entendi
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
