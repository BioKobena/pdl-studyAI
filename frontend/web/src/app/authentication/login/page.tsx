'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
<<<<<<< HEAD
import { Mail } from 'lucide-react';
import { login, type LoginRequest, type LoginSuccess } from '@/lib/api/auth';
import { saveUser } from '@/lib/session';

type Field = 'email' | 'password' | 'general';
type FieldErrors = Partial<Record<Field, string>>;
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: FieldErrors = {};
    if (!email.trim()) e.email = 'Email requis.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email invalide.';
    if (!password) e.password = 'Mot de passe requis.';
    setErrors(e);
    return e;
=======
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

      if ('error' in res) {
        setErr(res.error || "Identifiants invalides");
        return;
      }

      // succès: on sauvegarde l'utilisateur minimal et on redirige
      const u = res as LoginSuccess;
      saveUser({ id: u.id, email: u.email, fullName: u.fullName });

      router.push('/dashboard/upload');
    } catch (e: any) {
      setErr(e?.message || "Erreur réseau/serveur");
    } finally {
      setLoading(false);
    }
>>>>>>> d4dc2c874b9c19afd1141d330adc18d395eaeca8
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const eAll = validate();
    if (Object.values(eAll).some(Boolean)) return;

    setLoading(true);
    try {
      const res = await login({ email: email.trim(), password } as LoginRequest);

      // Le back renvoie { error } en cas d’échec
      // On affiche un message propre et **pas** l’objet JSON brut
      // Tu peux cibler le champ email si le message contient "Utilisateur introuvable"
      // ici on met en "general"
      if ((res as any)?.error) {
        setErrors({ general: (res as any).error || 'Identifiants invalides.' });
        return;
      }

      const u = res as LoginSuccess;
      saveUser({ id: u.id, email: u.email, fullName: u.fullName });
      router.push('/dashboard/upload');
    } catch {
      setErrors({ general: 'Erreur réseau/serveur. Réessayez.' });
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

      <form onSubmit={onSubmit} className="space-y-6">

        {errors.general && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
            {errors.general}
          </div>
        )}

        {/* Email */}
        <div>
<<<<<<< HEAD
          <Label htmlFor="email" className="text-[#3FA9D9] mb-2 block">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="e@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => validate()}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
              className={cn(
                'pr-10 bg-white text-gray-600',
                errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-[#3FA9D9]'
              )}
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.email && <p id="email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>}
=======
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
>>>>>>> d4dc2c874b9c19afd1141d330adc18d395eaeca8
        </div>

        {/* Mot de passe */}
        <div>
          <Label htmlFor="mot-password" className="text-[#3FA9D9] mb-2 block">Mot de passe</Label>
          <Input
            id="mot-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onBlur={() => validate()}
            aria-invalid={!!errors.password}
            aria-describedby="pwd-error"
            className={cn(
              'bg-white text-gray-600',
              errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-[#3FA9D9]'
            )}
          />
          {errors.password && <p id="pwd-error" className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        {/* Lien mot de passe oublié */}
        <div className="text-right">
          <a href="/authentication/reset-password" className="text-[#FF9966] text-sm hover:underline">
            Mot de passe oublié ?
          </a>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3FA9D9] hover:bg-[#2B7FB5] text-white"
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </Button>
      </form>

      <p className="text-center mt-8 text-gray-700">
        Vous n&apos;avez pas de compte ?{' '}
        <a href="/authentication/register" className="text-[#3FA9D9] hover:underline">S&apos;inscrire</a>
      </p>
    </div>
  );
}
