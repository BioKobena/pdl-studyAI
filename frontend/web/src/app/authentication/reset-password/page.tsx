"use client";

import { useState } from "react";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RequestResetPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/authentication/reset-password/success");

    // router.push("/authentication/reset-password/success?email=" + encodeURIComponent(email));
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#2e89d6]">
            Réinitialiser le mot de passe
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Renseigne ton email, on t’envoie un lien de réinitialisation.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#3FA9D9] mb-2 block">
            Adresse email
          </Label>
          <Input
            id="email"
            type="email"
            className="pr-10 bg-white text-gray-600 border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#3FA9D9] hover:bg-[#2B7FB5] text-white"
        >
          Continuer
        </Button>

        <p className="text-sm text-gray-600">
          <Link
            className="text-[#2e89d6] underline"
            href="/authentication/login"
          >
            Retour à la connexion
          </Link>
        </p>
      </form>
    </div>
  );
}
