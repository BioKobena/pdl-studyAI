"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/component/ui/button";
import PasswordInput from "@/component/ui/password-input";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/authentication/reset-password/ready");
  };

  return (
    <div>
      <h2 className="text-[#3FA9D9] text-2xl font-semibold mb-6">
        Créer un nouveau mot de passe
      </h2>

      <p className="text-gray-600 mb-8">
        Saisissez et confirmez votre nouveau mot de passe.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* password */}
        <div>
          <PasswordInput label="Nouveau mot de passe" id="new-password" />
        </div>

        {/* Confirme Password */}
        <div>
          <PasswordInput
            label="Confirmation du mot de passe "
            id="confirm-mot-password"
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full bg-[#3FA9D9] hover:bg-[#2B7FB5] text-white"
        >
          Continuer
        </Button>
      </form>
    </div>
  );
}
