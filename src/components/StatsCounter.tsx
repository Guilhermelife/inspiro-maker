import { useFavorites } from '@/hooks/useFavorites';
import { useQuoteHistory } from '@/hooks/useQuoteHistory';

export const StatsCounter = () => {
  const { favorites } = useFavorites();
  const { history } = useQuoteHistory();

  return (
    <div className="flex items-center justify-center gap-6 text-center py-4 backdrop-blur-md bg-background/60 rounded-2xl px-6 border border-border/50 shadow-lg animate-fade-in">
      <div>
        <p className="text-2xl font-bold text-primary">{favorites.length}</p>
        <p className="text-xs text-muted-foreground">Favoritas</p>
      </div>
      <div className="h-8 w-[1px] bg-border" />
      <div>
        <p className="text-2xl font-bold text-primary">{history.length}</p>
        <p className="text-xs text-muted-foreground">Vistas</p>
      </div>
    </div>
  );
};
