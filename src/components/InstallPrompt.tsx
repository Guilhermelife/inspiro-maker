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
      {/* Banner de Instalação */}
      {(isInstallable || isIOS) && (
        <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 p-4 shadow-xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">
                Instalar Frases do Dia
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Acesse mais rápido e use offline instalando nosso app!
              </p>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleInstall}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Instalar
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setShowBanner(false)}
                >
                  Agora não
                </Button>
              </div>
            </div>
            
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 -mt-1 -mr-1"
              onClick={() => setShowBanner(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
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
