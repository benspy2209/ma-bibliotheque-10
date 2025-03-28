
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { Helmet } from "react-helmet-async";
import NavBar from "@/components/NavBar";

export default function ResetPassword() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Réinitialisation du mot de passe | Biblioapp</title>
      </Helmet>
      
      <NavBar />
      
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-md">
            <UpdatePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
