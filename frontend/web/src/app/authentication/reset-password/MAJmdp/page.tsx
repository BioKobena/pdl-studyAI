"use client";

import { useRouter } from "next/navigation";

export default function VerifiedPage() {
  const router = useRouter();
  return (
    <div>
      <div className="max-w-md w-full text-center">
        <h1 className="text-[22px] font-semibold text-[#3FA9D9]">
          Mot de passe mis à jour !
        </h1>
        <p className="text-sm text-gray-700 mt-4">
          Vous pouvez maintenant créer un nouveau mot de passe pour votre
          compte.
          <br />
          Appuyez sur <strong>Confirmer</strong> pour continuer.
        </p>

        <button
          onClick={() =>
            router.push(`/authentication/reset-password/NewPassword`)
          }
          className="w-full mt-8 h-14 rounded-full bg-[#3F89BD] hover:bg-[#3579A8] text-white text-[18px] font-semibold"
        >
          Confirmer
        </button>
      </div>
    </div>
  );
}
