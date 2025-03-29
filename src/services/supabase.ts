
import { supabase } from '@/integrations/supabase/client';

export async function updateBookStatus({ bookId, status }: { bookId: string; status: string }) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('books')
      .update({ status })
      .eq('id', bookId)
      .eq('user_id', user.id);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error updating book status:', error);
    throw error;
  }
}
