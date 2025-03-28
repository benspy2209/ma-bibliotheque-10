
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { AdminUsersStats } from "@/components/statistics/AdminUsersStats";

export function AdminSection() {
  const { user } = useSupabaseAuth();
  const isAdmin = user?.email === 'debruijneb@gmail.com';

  if (!isAdmin) {
    return null;
  }

  return <AdminUsersStats />;
}
