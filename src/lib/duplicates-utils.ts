
import { Book } from '@/types/book';
import { normalizeString } from './core-utils';

export function removeDuplicateBooks(books: Book[]): Book[] {
  const uniqueBooks: Book[] = [];
  const seenTitles = new Map<string, boolean>();
  const seenIds = new Set<string>();
  
  for (const book of books) {
    // Skip books with no title or author
    if (!book.title || !book.author) continue;
    
    // Create normalized keys for comparison
    const titleNormalized = normalizeString(book.title);
    const authorNormalized = Array.isArray(book.author) 
      ? book.author.map(a => normalizeString(a)).sort().join('|')
      : normalizeString(book.author);
    
    // Create a unique key combining title and author
    const bookKey = `${titleNormalized}___${authorNormalized}`;
    
    // Skip if we've seen this title/author combination or this exact ID before
    if (seenTitles.has(bookKey) || seenIds.has(book.id)) {
      continue;
    }
    
    // Add the book and mark it as seen
    uniqueBooks.push(book);
    seenTitles.set(bookKey, true);
    seenIds.add(book.id);
  }
  
  return uniqueBooks;
}

export function isDuplicateBook(existingBooks: Book[], newBook: Book): boolean {
  if (!newBook || !newBook.title || !newBook.author) return false;
  
  // Normalize the book data for comparison
  const newBookTitle = normalizeString(newBook.title);
  const newBookAuthor = Array.isArray(newBook.author)
    ? newBook.author.map(a => normalizeString(a)).sort().join('|')
    : normalizeString(newBook.author);
  
  // Build a unique key for the new book
  const newBookKey = `${newBookTitle}___${newBookAuthor}`;
  
  // Check against existing books
  for (const book of existingBooks) {
    // Skip if same ID (it's the same book)
    if (book.id === newBook.id) continue;
    
    if (!book.title || !book.author) continue;
    
    // Normalize existing book data
    const existingBookTitle = normalizeString(book.title);
    const existingBookAuthor = Array.isArray(book.author)
      ? book.author.map(a => normalizeString(a)).sort().join('|')
      : normalizeString(book.author);
    
    // Build a unique key for the existing book
    const existingBookKey = `${existingBookTitle}___${existingBookAuthor}`;
    
    // Compare keys
    if (existingBookKey === newBookKey) {
      // Found a duplicate
      return true;
    }
    
    // Additional check for subtitle variations (common in book titles)
    // For example "Book Title" and "Book Title: The Sequel"
    if (existingBookTitle.includes(newBookTitle) || newBookTitle.includes(existingBookTitle)) {
      // If titles have overlap, check if authors are the same
      if (existingBookAuthor === newBookAuthor) {
        // Check if one title is a subset of the other (potential subtitle)
        if (Math.abs(existingBookTitle.length - newBookTitle.length) > 3) {
          return true;
        }
      }
    }
  }
  
  return false;
}
