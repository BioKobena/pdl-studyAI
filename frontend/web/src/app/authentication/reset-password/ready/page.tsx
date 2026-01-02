"use client";

import Link from "next/link";

export default function UpdatedSuccessPage() {
  return (
    <div>
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 w-24 h-24 rounded-full border-2 border-[#3F89BD] flex items-center justify-center">
          <span className="text-3xl text-[#3F89BD]">✓</span>
        </div>

        <h1 className="text-[22px] font-semibold text-[#3FA9D9]">
          Mot de passe mis à jour !
        </h1>
        <p className="text-sm text-gray-700 mt-3">
          Bravo ! Votre mot de passe a bien été changé.
          <br />
          Appuyez sur <strong>Se connecter</strong> pour accéder à votre compte.
        </p>

        <Link
          href="/authentication/login"
          className="inline-flex w-full justify-center mt-8 h-14 rounded-full bg-[#3F89BD] hover:bg-[#3579A8] text-white text-[18px] font-semibold items-center"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}
