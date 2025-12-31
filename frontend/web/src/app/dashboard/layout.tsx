"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { withAuth } from "@/lib/api/withAuth.client";
import { getToken, setToken } from "@/lib/api/http";
import { getUser } from "@/lib/session";
import { useEffect, useState } from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // état local pour l’utilisateur
  const [name] = useState<string | null>(getUser()?.fullName ?? null);

  useEffect(() => {
    const t = getToken();
    if (!t) return;
    // tu peux appeler http("/api/users/me", { method:"GET", auth:true }) si tu veux
  }, []);
  const onLogout = () => {
    setToken(null); // supprime le token
    router.replace("/authentication/login"); // renvoie vers login
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#3FA9D9] text-white px-8 py-4 flex justify-between items-center">
        {/* Logo à gauche */}
        <Link href="#" className="flex items-center gap-2">
          <Image
            src="/logoStudyAI.png"
            alt="logoStudyAI Logo"
            width={100}
            height={100}
          />
        </Link>

        {/* Liens de navigation */}
        <div className="flex items-center gap-4">
          {/* Liens principaux */}
          <div className="flex gap-4">
            <span className="opacity-90">
              {name ? `Bonjour, ${name}` : "Bonjour"}
            </span>
            <Link href="#" className="hover:underline">
              Accueil
            </Link>
            <Link href="#" className="hover:underline">
              Inviter vos amis
            </Link>
            <button onClick={onLogout} className="hover:underline">
              Se Déconnecter
            </button>
          </div>

          {/* Bouton Créer un compte à droite */}
          {/* <Link
                        href="#"
                        className="bg-white text-[#3FA9D9] px-4 py-2 rounded shadow hover:bg-gray-100 transition"
                    >
                        Créer un compte
                    </Link>
                   */}
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
export default withAuth(Layout);
