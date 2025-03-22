
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { Helmet } from "react-helmet-async";

export default function ResetPassword() {
  return (
    <div className="container mx-auto px-4">
      <Helmet>
        <title>Réinitialisation du mot de passe | Biblioapp</title>
      </Helmet>
      
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
}
