
import React from 'react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { Navigate } from 'react-router-dom';
import { UserProfileForm } from '@/components/profile/UserProfileForm';

export default function Profile() {
  const { user, isLoading } = useSupabaseAuth();

  // Rediriger vers la page de connexion si non connecté
  if (!isLoading && !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Votre profil</h1>
      
      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center">
            <p>Chargement du profil...</p>
          </div>
        ) : (
          <UserProfileForm />
        )}
      </div>
    </div>
  );
}
