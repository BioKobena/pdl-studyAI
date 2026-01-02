
"use client";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
    return (
        <nav className="bg-[#3FA9D9] text-white px-8 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/logoStudyAI.png" alt="StudyAI Logo" width={100} height={100} style={{ width: "auto", height: "auto" }} priority />
                <span className="font-bold text-xl">StudyAI</span>
            </Link>

            <div className="flex items-center gap-6">
                <Link href="/" className="hover:underline">Accueil</Link>
                <Link href="#comment-ca-marche" className="hover:underline">Comment ça marche</Link>
                <Link href="/authentication/login" className="hover:underline">Se connecter</Link>
                <Link href="/authentication/register" className="hover:underline">S&#39;inscrire</Link>
            </div>
        </nav>
    );
}
