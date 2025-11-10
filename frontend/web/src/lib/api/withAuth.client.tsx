"use client"; 
// ⬆️ Indique à Next.js que ce fichier est exécuté côté client (obligatoire car on utilise useEffect / useRouter)

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api/http"; // récupère le token depuis le localStorage

// On importe seulement les TYPES de React (pas le runtime)
import type * as React from "react";

/**
 * HOC (Higher-Order Component) qui "enveloppe" une page ou un composant
 * pour le rendre accessible uniquement si l'utilisateur a un token.
 *
 * @param Comp - Le composant (page) à protéger
 */
export function withAuth<P extends object>(Comp: React.ComponentType<P>) {
  // On retourne un nouveau composant "Guard" qui ajoute la logique d'auth
  return function Guard(props: P) {
    const router = useRouter();

    useEffect(() => {
      // 1) On vérifie s'il y a un token (stocké dans le localStorage)
      const token = getToken();

      // 2) S'il n'y a PAS de token → on redirige vers la page de login
      if (!token) {
        // On garde la page demandée pour y revenir après le login
        // window.location.pathname = "/resume" par ex.
        const next =
          typeof window !== "undefined" ? window.location.pathname : "/";

        // Redirection côté client
        // 💡 Si ta page de login est à /authentication/login,
        //    remplace "/login" ci-dessous par "/authentication/login"
        router.replace(`/authentication/login`);
      }
    }, [router]); // dépendance sur router (bonne pratique)

    // 3) Si on a un token, on rend simplement le composant protégé
    //    On transmet toutes les props telles quelles (...props)
    return <Comp {...props} />;
  };
}
