"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from 'next/navigation';

import Link from "next/link";

// masque sympa si tu passes ?email=contact@example.com dans l’URL
function maskEmail(email?: string) {
  if (!email) return "votre e-mail";
  const [name, domain] = email.split("@");
  const masked =
    name.length > 2 ? name[0] + "•".repeat(name.length - 2) + name.slice(-1) : "••";
  return `${masked}@${domain}`;
}

export default function VerifyEmail() {
  // récupère l’email via l’URL côté client (facile et robuste)
  const [rawEmail, setRawEmail] = useState<string | undefined>(undefined);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRawEmail(params.get("email") || undefined);
  }, []);
  const emailShown = useMemo(() => maskEmail(rawEmail), [rawEmail]);

  // 4 chiffres (comme ta maquette)
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const onChange = (idx: number, value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 1);
    setCode((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });
    if (v && idx < code.length - 1) inputsRef.current[idx + 1]?.focus();
  };

  const onKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < code.length - 1) inputsRef.current[idx + 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    e.preventDefault();
    const arr = pasted.split("");
    setCode((_) => {
      const next = ["", "", "", ""];
      for (let i = 0; i < Math.min(arr.length, 4); i++) next[i] = arr[i];
      return next;
    });
    inputsRef.current[Math.min(arr.length, 4) - 1]?.focus();
  };
        const router = useRouter();

  const codeValue = code.join("");
  const canSubmit = codeValue.length === 4;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    // TODO: POST /api/auth/verify-code { email: rawEmail, code: codeValue }
   // alert(`Code soumis : ${codeValue}`);
    // redirect vers succès si OK
    router.push('/authentication/reset-password/MAJmdp');
  };

  const handleResend = async () => {
    // TODO: POST /api/auth/resend-code { email: rawEmail }
    alert(`Nouveau code envoyé à ${emailShown}`);
  };

  return (
    <div>
      {/* Header */}
     

      {/* Contenu */}
      <main className="max-w-md mx-auto px-6">
        <h1 className="text-[26px] sm:text-[28px] font-semibold text-center text-[#3FA9D9] mt-3">
          Vérifiez votre e-mail
        </h1>

        <p className="text-[15px] text-gray-700 mt-5 text-center leading-6">
          Nous avons envoyé un code à <span className="font-medium text-gray-900">{emailShown}</span>.
          <br />
          Entrez le code à 4 chiffres reçu dans votre e-mail.
        </p>

        <form onSubmit={handleSubmit} className="mt-7">
          <div className="flex justify-between gap-4">
            {code.map((digit, idx) => (
              <input
                key={idx}
                
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => onChange(idx, e.target.value)}
                onKeyDown={(e) => onKeyDown(idx, e)}
                onPaste={onPaste}
                className="w-52 h-48 sm:w-24 sm:h-18 rounded-xl border-2 border-[#3F89BD] bg-white text-center text-2xl font-semibold outline-none focus:ring-2 focus:ring-[#3FA9D9]"
              />
            ))}
          </div>

          {/* Bouton pill arrondi */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-[#3FA9D9] hover:bg-[#2B7FB5] text-white mt-8 ml-4 "      >
            Suivant
          </button>
          
        </form>

        <p className="text-center text-[15px] text-gray-700 mt-5">
          Vous n’avez pas reçu le code ?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="text-[#3FA9D9] font-semibold underline underline-offset-2"
          >
            Renvoyer
          </button>
        </p>
        
      </main>
    </div>
  );
}
