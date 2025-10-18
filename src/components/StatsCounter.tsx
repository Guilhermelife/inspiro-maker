import { useFavorites } from '@/hooks/useFavorites';
import { useQuoteHistory } from '@/hooks/useQuoteHistory';
import { useState, useEffect } from 'react';

export const StatsCounter = () => {
  const { favorites } = useFavorites();
  const { history } = useQuoteHistory();
  const [totalShared, setTotalShared] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('total_shares');
    if (stored) {
      setTotalShared(parseInt(stored, 10));
    }
  }, []);

  return (
    <div className="flex items-center justify-center gap-6 text-center py-4 backdrop-blur-md bg-background/60 rounded-2xl px-6 border border-border/50 shadow-lg animate-fade-in">
      <div>
        <p className="text-2xl font-bold text-primary">{favorites.length}</p>
        <p className="text-xs text-muted-foreground">Favoritas</p>
      </div>
      <div className="h-8 w-[1px] bg-border" />
      <div>
        <p className="text-2xl font-bold text-primary">{totalShared}</p>
        <p className="text-xs text-muted-foreground">Compartilhadas</p>
      </div>
      <div className="h-8 w-[1px] bg-border" />
      <div>
        <p className="text-2xl font-bold text-primary">{history.length}</p>
        <p className="text-xs text-muted-foreground">Vistas</p>
      </div>
    </div>
  );
};

export const incrementShareCount = () => {
  const stored = localStorage.getItem('total_shares');
  const current = stored ? parseInt(stored, 10) : 0;
  localStorage.setItem('total_shares', (current + 1).toString());
};
