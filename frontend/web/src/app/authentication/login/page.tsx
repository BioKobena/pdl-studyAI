'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
import { Mail} from 'lucide-react';
import PasswordInput  from "@/component/ui/password-input";
import { login, type LoginRequest, type LoginSuccess, type LoginError } from '@/lib/api/auth';
import { saveUser } from '@/lib/session';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        const email = (document.getElementById("email") as HTMLInputElement)?.value.trim();
    const password = (document.getElementById("mot-password") as HTMLInputElement)?.value;

    try {
      const res = await login({ email, password } as LoginRequest);

     
      // succès: on sauvegarde l'utilisateur minimal et on redirige
      const u = res as LoginSuccess;
      saveUser({ id: u.id, email: u.email, fullName: u.fullName });

      router.push('/dashboard/upload');
    } catch (e: any) {
      setErr(e?.message || "Erreur réseau/serveur");
    } finally {
      setLoading(false);
    }
  };

    return (
        <div>
            <h2 className="text-[#3FA9D9] text-2xl font-semibold mb-6">CONNEXION</h2>

            <p className="text-gray-600 mb-8">
                Heureux de vous revoir, entrez vos identifiants pour vous connecter
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                    <Label htmlFor="text" className="text-[#3FA9D9] mb-2 block">
                        Email
                    </Label>
                    <div className="relative">
                        <Input
                            id="email"
                            type="text"
                            placeholder="groupepedistic@gmail.com"
                            className="pr-10 bg-white text-gray-600 border-gray-300"
                        />
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <PasswordInput label="Mot de passe" id="mot-password" />
                </div>

                {/* Forgot password */}
                <div className="text-right">
                    <a href="/authentication/reset-password" className="text-[#FF9966] text-sm hover:underline">
                        Mot de passe oublié ?
                    </a>
                </div>
                 {err && <p className="text-sm text-red-600">{err}</p>}

                {/* Submit button */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#3FA9D9] hover:bg-[#2B7FB5] text-white"
                
                >
                    Se connecter
                </Button>
            </form>

            {/* Sign up link */}
            <p className="text-center mt-8 text-gray-700">
                Vous n&apos;avez pas de compte ?{' '}
                <a href="/authentication/register" className="text-[#3FA9D9] hover:underline">
                    S&apos;inscrire
                </a>
            </p>
        </div>
    );
}