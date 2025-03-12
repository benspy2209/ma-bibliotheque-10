
import { createClient } from '@supabase/supabase-js';
import { Book } from '@/types/book';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function saveBook(book: Book) {
  const { error } = await supabase
    .from('books')
    .upsert({
      id: book.id,
      book_data: book,
      status: book.status,
      completion_date: book.completionDate,
      user_id: (await supabase.auth.getUser()).data.user?.id
    });

  if (error) throw error;
}

export async function loadBooks() {
  const { data, error } = await supabase
    .from('books')
    .select('book_data')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(row => row.book_data as Book) ?? [];
}

export async function deleteBook(bookId: string) {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', bookId);

  if (error) throw error;
}
