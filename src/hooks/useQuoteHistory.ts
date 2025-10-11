import { useState, useEffect } from 'react';

const HISTORY_KEY = 'quote_history';
const MAX_HISTORY_SIZE = 20;
const HISTORY_EXPIRY_DAYS = 1;

interface QuoteHistoryItem {
  text: string;
  timestamp: number;
}

export const useQuoteHistory = () => {
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed: QuoteHistoryItem[] = JSON.parse(stored);
        const now = Date.now();
        const expiryTime = HISTORY_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        
        // Filter out expired entries
        const validItems = parsed.filter(
          item => now - item.timestamp < expiryTime
        );
        
        setHistory(validItems.map(item => item.text));
        
        // Update localStorage if we filtered anything
        if (validItems.length !== parsed.length) {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(validItems));
        }
      }
    } catch (error) {
      console.error('Error loading quote history:', error);
      localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  const addToHistory = (quoteText: string) => {
    setHistory(prev => {
      // Don't add if already the most recent
      if (prev[0] === quoteText) return prev;
      
      // Add to beginning and keep only MAX_HISTORY_SIZE items
      const updated = [quoteText, ...prev.filter(q => q !== quoteText)]
        .slice(0, MAX_HISTORY_SIZE);
      
      // Save to localStorage with timestamps
      const items: QuoteHistoryItem[] = updated.map(text => ({
        text,
        timestamp: Date.now(),
      }));
      localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
      
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  return {
    history,
    addToHistory,
    clearHistory,
  };
};
