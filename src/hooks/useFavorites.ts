import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'favorite_quotes';

export interface FavoriteQuote {
  id: string;
  quote_text: string;
  author: string;
  category?: string;
  created_at: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteQuote[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      localStorage.removeItem(FAVORITES_KEY);
    }
  }, []);

  const saveFavorites = (newFavorites: FavoriteQuote[]) => {
    setFavorites(newFavorites);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addFavorite = (quote: Omit<FavoriteQuote, 'id' | 'created_at'>) => {
    const newFavorite: FavoriteQuote = {
      ...quote,
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      created_at: new Date().toISOString(),
    };
    saveFavorites([newFavorite, ...favorites]);
  };

  const removeFavorite = (id: string) => {
    saveFavorites(favorites.filter(fav => fav.id !== id));
  };

  const isFavorited = (quoteText: string) => {
    return favorites.some(fav => fav.quote_text === quoteText);
  };

  const getFavoriteByText = (quoteText: string) => {
    return favorites.find(fav => fav.quote_text === quoteText);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorited,
    getFavoriteByText,
  };
};
