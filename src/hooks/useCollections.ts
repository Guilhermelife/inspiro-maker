import { useState, useEffect } from 'react';

export interface Collection {
  id: string;
  name: string;
  icon: string;
  quoteIds: string[];
  createdAt: number;
}

export const useCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('quote_collections');
    if (stored) {
      setCollections(JSON.parse(stored));
    }
  }, []);

  const saveCollections = (newCollections: Collection[]) => {
    localStorage.setItem('quote_collections', JSON.stringify(newCollections));
    setCollections(newCollections);
  };

  const addCollection = (name: string, icon: string = '📁') => {
    const newCollection: Collection = {
      id: crypto.randomUUID(),
      name,
      icon,
      quoteIds: [],
      createdAt: Date.now(),
    };
    saveCollections([...collections, newCollection]);
    return newCollection;
  };

  const deleteCollection = (collectionId: string) => {
    saveCollections(collections.filter(c => c.id !== collectionId));
  };

  const addQuoteToCollection = (quoteId: string, collectionId: string) => {
    const updatedCollections = collections.map(collection => {
      if (collection.id === collectionId && !collection.quoteIds.includes(quoteId)) {
        return {
          ...collection,
          quoteIds: [...collection.quoteIds, quoteId],
        };
      }
      return collection;
    });
    saveCollections(updatedCollections);
  };

  const removeQuoteFromCollection = (quoteId: string, collectionId: string) => {
    const updatedCollections = collections.map(collection => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          quoteIds: collection.quoteIds.filter(id => id !== quoteId),
        };
      }
      return collection;
    });
    saveCollections(updatedCollections);
  };

  const getCollectionsByQuote = (quoteId: string) => {
    return collections.filter(collection => collection.quoteIds.includes(quoteId));
  };

  return {
    collections,
    addCollection,
    deleteCollection,
    addQuoteToCollection,
    removeQuoteFromCollection,
    getCollectionsByQuote,
  };
};
