import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export const UpdatePrompt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  if (!needRefresh && !offlineReady) return null;

  return (
    <Card className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 p-4 shadow-xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <RefreshCw className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1">
          {needRefresh && (
            <>
              <h3 className="font-semibold text-sm mb-1">
                Nova versão disponível!
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Atualize para aproveitar as melhorias mais recentes.
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleUpdate}>
                  Atualizar Agora
                </Button>
                <Button size="sm" variant="ghost" onClick={close}>
                  Depois
                </Button>
              </div>
            </>
          )}
          
          {offlineReady && (
            <>
              <h3 className="font-semibold text-sm mb-1">
                App pronto para uso offline!
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Você pode usar o app mesmo sem conexão.
              </p>
              <Button size="sm" variant="ghost" onClick={close}>
                Ok, entendi
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
