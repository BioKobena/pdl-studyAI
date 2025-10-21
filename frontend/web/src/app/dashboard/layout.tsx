import Image from 'next/image';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-[#3FA9D9] text-white px-8 py-4 flex justify-between items-center">
                {/* Logo à gauche */}
                <Link href="#" className="flex items-center gap-2">
                    <Image src="/logoStudyAI.png" alt="logoStudyAI Logo" width={100} height={100} />
                </Link>

                {/* Liens de navigation */}
                <div className="flex items-center gap-4">
                    {/* Liens principaux */}
                    <div className="flex gap-4">
                        <Link href="#" className="hover:underline">Accueil</Link>
                        <Link href="#" className="hover:underline">Inviter vos amis</Link>
                        <Link href="#" className="hover:underline">Se connecter</Link>
                    </div>

                    {/* Bouton Créer un compte à droite */}
                    <Link
                        href="#"
                        className="bg-white text-[#3FA9D9] px-4 py-2 rounded shadow hover:bg-gray-100 transition"
                    >
                        Créer un compte
                    </Link>
                </div>

            </nav>

            {/* Contenu principal */}
            <main className="flex-1 p-8 bg-gray-50">{children}</main>
        </div>
    );
}
