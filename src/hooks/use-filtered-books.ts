
import { useState, useEffect, useMemo } from 'react';
import { Book } from '@/types/book';
import { getYear } from 'date-fns';

export function useFilteredBooks(books: Book[], selectedYear: number | null, allCompletedBooks: Book[]) {
  // Ajout d'un forceUpdate pour garantir la réactivité
  const [updateCounter, setUpdateCounter] = useState(0);
  
  // Force un recalcul lorsque les livres ou les livres complétés changent
  useEffect(() => {
    console.log("useFilteredBooks: Détection de changement dans books ou allCompletedBooks");
    console.log(`useFilteredBooks: Nombre total de livres: ${books.length}, complétés: ${allCompletedBooks.length}`);
    setUpdateCounter(prev => prev + 1);
  }, [books, allCompletedBooks, books.length, allCompletedBooks.length]);
  
  // Ajouter un intervalle pour forcer le rafraîchissement périodique
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateCounter(prev => prev + 1);
    }, 3000); // Toutes les 3 secondes pour plus de réactivité
    
    return () => clearInterval(interval);
  }, []);
  
  const completedBooks = useMemo(() => {
    console.log(`useFilteredBooks: Recalcul des livres complétés pour l'année ${selectedYear} (${updateCounter})`);
    console.log("useFilteredBooks: Nombre total de livres complétés:", allCompletedBooks.length);
    
    // Log détaillé pour le débogage
    allCompletedBooks.forEach((book, index) => {
      console.log(`Livre complété #${index + 1}:`, book.title, "Statut:", book.status, "Date de complétion:", book.completionDate);
    });
    
    if (!selectedYear) return allCompletedBooks;
    
    return allCompletedBooks.filter(book => {
      if (!book.completionDate) return false;
      const completionYear = getYear(new Date(book.completionDate));
      const matches = completionYear === selectedYear;
      if (matches) {
        console.log(`Livre correspondant à l'année ${selectedYear}:`, book.title);
      }
      return matches;
    });
  }, [selectedYear, allCompletedBooks, updateCounter]);
  
  const readingBooks = useMemo(() => {
    console.log("useFilteredBooks: Recalcul des livres en cours de lecture");
    const result = books.filter((book): book is Book =>
      book !== null && book.status === 'reading'
    );
    console.log(`Livres en cours de lecture trouvés: ${result.length}`);
    return result;
  }, [books, updateCounter]);

  const toReadBooks = useMemo(() => {
    console.log("useFilteredBooks: Recalcul des livres à lire");
    const result = books.filter((book): book is Book =>
      book !== null && (!book.status || book.status === 'to-read')
    );
    console.log(`Livres à lire trouvés: ${result.length}`);
    return result;
  }, [books, updateCounter]);

  // Comptage des livres achetés et à acheter avec une logique non-exclusive
  const { purchasedBooks, toBuyBooks } = useMemo(() => {
    // Livres achetés = explicitement marqués purchased=true, peu importe le statut
    const purchased = books.filter(book => book.purchased === true).length;
    
    // Livres à acheter = non achetés (purchased=false) ET (status=to-read ou undefined)
    const toBuy = books.filter(book => 
      book.purchased === false && (!book.status || book.status === 'to-read')
    ).length;
    
    console.log(`useFilteredBooks: Livres achetés: ${purchased}, Livres à acheter: ${toBuy}`);
    
    return { purchasedBooks: purchased, toBuyBooks: toBuy };
  }, [books, updateCounter]);

  return {
    completedBooks,
    readingBooks,
    toReadBooks,
    purchasedBooks,
    toBuyBooks
  };
}
