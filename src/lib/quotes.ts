import { supabase } from "@/integrations/supabase/client";

export interface Quote {
  text: string;
  author: string;
  category: string;
}

// Cache de frases do banco
let databaseQuotesCache: Quote[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Banco local de frases para fallback
export const localQuotes: Quote[] = [
  {
    text: "Acredite em si mesmo e tudo será possível.",
    author: "Anônimo",
    category: "Motivacional"
  },
  {
    text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    author: "Robert Collier",
    category: "Motivacional"
  },
  {
    text: "A vida é 10% o que acontece com você e 90% como você reage a isso.",
    author: "Charles R. Swindoll",
    category: "Reflexiva"
  },
  {
    text: "Não conte os dias, faça os dias contarem.",
    author: "Muhammad Ali",
    category: "Motivacional"
  },
  {
    text: "O Senhor é meu pastor e nada me faltará.",
    author: "Salmos 23:1",
    category: "Bíblica"
  },
  {
    text: "Tudo posso naquele que me fortalece.",
    author: "Filipenses 4:13",
    category: "Bíblica"
  },
  {
    text: "O amor é paciente, o amor é bondoso.",
    author: "1 Coríntios 13:4",
    category: "Amor & Espiritual"
  },
  {
    text: "A única maneira de fazer um ótimo trabalho é amar o que você faz.",
    author: "Steve Jobs",
    category: "De Autor"
  },
  {
    text: "Seja a mudança que você quer ver no mundo.",
    author: "Mahatma Gandhi",
    category: "De Autor"
  },
  {
    text: "A imaginação é mais importante que o conhecimento.",
    author: "Albert Einstein",
    category: "De Autor"
  },
  {
    text: "Quem tem um porquê enfrenta qualquer como.",
    author: "Friedrich Nietzsche",
    category: "Reflexiva"
  },
  {
    text: "A persistência é o caminho do êxito.",
    author: "Charlie Chaplin",
    category: "Motivacional"
  },
  {
    text: "Pare de reclamar da vida e comece a construí-la.",
    author: "Anônimo",
    category: "Motivação Reversa"
  },
  {
    text: "Ninguém vai fazer por você. Levanta e age agora.",
    author: "Anônimo",
    category: "Motivação Reversa"
  },
  {
    text: "Suas desculpas não vão te levar a lugar nenhum.",
    author: "Anônimo",
    category: "Motivação Reversa"
  },
  {
    text: "Ou você faz acontecer, ou fica vendo os outros fazerem.",
    author: "Anônimo",
    category: "Motivação Reversa"
  },
  {
    text: "Conforto não constrói caráter. Dificuldade sim.",
    author: "Anônimo",
    category: "Motivação Reversa"
  },
];

// Buscar frases do banco de dados
export const fetchDatabaseQuotes = async (): Promise<Quote[]> => {
  const now = Date.now();
  
  // Usar cache se ainda válido
  if (databaseQuotesCache.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
    return databaseQuotesCache;
  }

  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('text, author, category')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching database quotes:', error);
      return [];
    }

    databaseQuotesCache = data || [];
    lastFetchTime = now;
    return databaseQuotesCache;
  } catch (error) {
    console.error('Error in fetchDatabaseQuotes:', error);
    return [];
  }
};

// Combinar frases do banco com frases locais
const getAllQuotes = async (): Promise<Quote[]> => {
  const dbQuotes = await fetchDatabaseQuotes();
  return [...dbQuotes, ...localQuotes];
};

export const getRandomQuote = async (excludeTexts: string[] = []): Promise<Quote> => {
  const allQuotes = await getAllQuotes();
  
  let availableQuotes = allQuotes;
  if (excludeTexts.length > 0) {
    availableQuotes = allQuotes.filter(q => !excludeTexts.includes(q.text));
  }
  
  if (availableQuotes.length === 0) {
    availableQuotes = allQuotes;
  }
  
  const randomIndex = Math.floor(Math.random() * availableQuotes.length);
  return availableQuotes[randomIndex];
};

export const getQuoteByCategory = async (category: string, excludeTexts: string[] = []): Promise<Quote> => {
  if (category === "aleatoria") {
    return getRandomQuote(excludeTexts);
  }
  
  const allQuotes = await getAllQuotes();
  let categoryQuotes = allQuotes.filter(
    q => q.category.toLowerCase() === category.toLowerCase()
  );
  
  if (excludeTexts.length > 0) {
    categoryQuotes = categoryQuotes.filter(q => !excludeTexts.includes(q.text));
  }
  
  if (categoryQuotes.length === 0) {
    return getRandomQuote(excludeTexts);
  }
  
  const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
  return categoryQuotes[randomIndex];
};
