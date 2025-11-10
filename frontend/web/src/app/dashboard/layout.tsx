'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/api/withAuth.client';
import { getToken,setToken } from '@/lib/api/http';
import { getMe,type Me } from '@/lib/api/user';
import { useEffect,useState } from 'react';


 function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    // état local pour l’utilisateur
  const [me, setMe] = useState<Me | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  useEffect(() => {
  const token = getToken();
  if (!token) {
    setLoadingMe(false);     // ✅ éviter le "Chargement..." infini quand pas de token
    return;
  }
    (async () => {
        try {
        const u = await getMe();
        const user = (u as any)?.user ?? u; // au cas où le back renvoie { user: {...} }
        if (user?.fullName) setMe(user);
        } catch {
        // http.ts gère déjà 401 -> redirection
        } finally {
        setLoadingMe(false);   // ✅ on éteint le loader quoi qu’il arrive
        }
    })();
    }, []);


    const onLogout = () => {
          setToken(null);           // supprime le token
        router.replace("/authentication/login"); // renvoie vers login
        };
    
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
                        <span className="opacity-90">
                    {loadingMe ? "Chargement..." : me ? `Bonjour, ${me.fullName}` : ""}
                </span>
                        <Link href="#" className="hover:underline">Accueil</Link>
                        <Link href="#" className="hover:underline">Inviter vos amis</Link>
                        <button  onClick={onLogout} className="hover:underline">Se Déconnecter</button>
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