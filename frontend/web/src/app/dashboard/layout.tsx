"use client";

import Image from "next/image";
import Link from "next/link";
import { withAuth } from "@/lib/api/withAuth.client";
import { getUser } from "@/lib/session";
import { useEffect, useState } from "react";
import { logout } from "@/lib/api/auth";

import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function Layout({ children }: { children: React.ReactNode }) {
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
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />

      <nav className="bg-[#3FA9D9] text-white px-8 py-4 flex justify-between items-center">
        <Link href="#" className="flex items-center gap-2">
          <Image
            src="/logoStudyAI.png"
            alt="StudyAI Logo"
            width={100}
            height={100}
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex gap-4 items-center">
            <span className="opacity-90">{isClient ? name : "Bonjour"}</span>

            <Link href="/dashboard" className="hover:underline">
              Accueil
            </Link>

            <Link href="#" className="hover:underline">
              Inviter vos amis
            </Link>

            <button onClick={onLogout} className="hover:underline">
              Se Déconnecter
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}

export default withAuth(Layout);
