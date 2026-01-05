"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { logout } from "@/lib/api/auth";
import toast from "react-hot-toast";
import router, { useRouter } from "next/navigation";
import { getUser } from "@/lib/session";

export function Navbar() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
      const [name, setName] = useState<string>("Bonjour");
      useEffect(() => {
          setIsClient(true);
          const u = getUser();
          setName(u?.fullName ? `Bonjour, ${u.fullName}` : "Bonjour");
        }, []);
        const onLogout = () => {
    // 1) purge token + storages
    logout();

    // 2) toast
    toast.success("Déconnecté", { duration: 1200 });

    // 3) navigation SPA (pas de reload)
    setTimeout(() => {
      router.replace("/authentication/login");
    }, 350);
  };
    return (
        <nav className="bg-[#3FA9D9] text-white px-8 py-4 flex justify-between items-center">
            {/* Logo → haut de page */}
            <Link href="/" className="flex items-center gap-2">
                <Image
                    src="/logoStudyAI.png"
                    alt="StudyAI Logo"
                    width={100}
                    height={100}
                    priority
                />
            </Link>

            <div className="flex items-center gap-6">
                <span className="opacity-90">{isClient ? name : "Bonjour"}</span>
                <Link href="#comment-ca-marche" className="hover:underline">
                    Comment ça marche
                </Link>

                <Link href="#a-propos" className="hover:underline">
                    À propos
                </Link>

                {name ? (
          // Si connecté → afficher bouton Déconnexion
          <button
            onClick={onLogout}
            className="hover:underline cursor-pointer"
          >
            Déconnexion
          </button>
        ) : (
          // Si non connecté → afficher Se connecter / S'inscrire
          <>
            <Link href="/authentication/login" className="hover:underline">
              Se connecter
            </Link>

            <Link href="/authentication/register" className="hover:underline">
              S'inscrire
            </Link>
          </>
        )}
            </div>
        </nav>
    );
}
