import { useEffect } from 'react';
import { useAdMob } from '@/hooks/useAdMob';

const AdBanner = () => {
  const { isNative, isInitialized, showBanner, removeBanner } = useAdMob();

  useEffect(() => {
    if (isNative && isInitialized) {
      showBanner();
    }

    return () => {
      if (isNative) {
        removeBanner();
      }
    };
  }, [isNative, isInitialized, showBanner, removeBanner]);

  // Se estiver rodando nativamente, não renderizar nada (AdMob usa overlay nativo)
  if (isNative) {
    return null;
  }

  // Fallback para web (placeholder)
  return (
    <div className="w-full border-t border-border backdrop-blur-sm bg-background/95 sticky bottom-0 z-10">
      <div className="max-w-screen-lg mx-auto flex items-center justify-center h-[60px] px-4">
        <div className="w-full max-w-[320px] h-[50px] rounded-lg bg-gradient-to-br from-secondary to-secondary/50 border border-border flex items-center justify-center">
          <p className="text-xs text-muted-foreground font-medium">
            Banner AdMob 320×50
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
