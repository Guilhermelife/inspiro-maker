import { useState, useEffect } from 'react';

const isYesterday = (dateString: string | null): boolean => {
  if (!dateString) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === yesterday.toDateString();
};

export const useStreaks = () => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    const lastVisit = localStorage.getItem('last_visit');
    const storedCurrentStreak = parseInt(localStorage.getItem('current_streak') || '0', 10);
    const storedBestStreak = parseInt(localStorage.getItem('best_streak') || '0', 10);
    
    const today = new Date().toDateString();
    
    if (lastVisit === today) {
      // Já visitou hoje
      setCurrentStreak(storedCurrentStreak);
      setBestStreak(storedBestStreak);
    } else if (isYesterday(lastVisit)) {
      // Mantém streak
      const newStreak = storedCurrentStreak + 1;
      setCurrentStreak(newStreak);
      localStorage.setItem('current_streak', newStreak.toString());
      
      if (newStreak > storedBestStreak) {
        setBestStreak(newStreak);
        localStorage.setItem('best_streak', newStreak.toString());
      } else {
        setBestStreak(storedBestStreak);
      }
    } else {
      // Perdeu streak
      setCurrentStreak(1);
      localStorage.setItem('current_streak', '1');
      setBestStreak(storedBestStreak);
    }
    
    localStorage.setItem('last_visit', today);
  }, []);
  
  return { currentStreak, bestStreak };
};
