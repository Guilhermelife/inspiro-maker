import { useState, useEffect } from 'react';

const USER_QUOTES_KEY = 'user_quotes';

export interface UserQuote {
  id: string;
  quote_text: string;
  author: string;
  profile_photo_url?: string;
  created_at: string;
}

export const useUserQuotes = () => {
  const [userQuotes, setUserQuotes] = useState<UserQuote[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_QUOTES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserQuotes(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading user quotes:', error);
      localStorage.removeItem(USER_QUOTES_KEY);
    }
  }, []);

  const saveUserQuotes = (newQuotes: UserQuote[]) => {
    setUserQuotes(newQuotes);
    try {
      localStorage.setItem(USER_QUOTES_KEY, JSON.stringify(newQuotes));
    } catch (error) {
      console.error('Error saving user quotes:', error);
    }
  };

  const addUserQuote = (text: string, author: string, photoUrl?: string) => {
    const newQuote: UserQuote = {
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      quote_text: text,
      author: author,
      profile_photo_url: photoUrl,
      created_at: new Date().toISOString(),
    };
    saveUserQuotes([newQuote, ...userQuotes]);
  };

  const removeUserQuote = (id: string) => {
    saveUserQuotes(userQuotes.filter(quote => quote.id !== id));
  };

  return {
    userQuotes,
    addUserQuote,
    removeUserQuote,
  };
};
