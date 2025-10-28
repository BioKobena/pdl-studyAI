'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
import { Mail, User } from 'lucide-react';
import PasswordInput from '@/component/ui/password-input';
import { signup, type SignupRequest } from '@/lib/api/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setOk(null);

    // Récupération des valeurs depuis le DOM (robuste même si PasswordInput est interne)
    const fullName = (document.getElementById('nompre') as HTMLInputElement)?.value.trim();
    const email = (document.getElementById('email') as HTMLInputElement)?.value.trim();
    const password = (document.getElementById('mot-password') as HTMLInputElement)?.value ?? '';
    const confirm = (document.getElementById('confirm-mot-password') as HTMLInputElement)?.value ?? '';

    // Validations simples
    if (!fullName || !email || !password || !confirm) {
      setErr('Tous les champs sont obligatoires.');
      return;
    }
    if (password !== confirm) {
      setErr('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const payload: SignupRequest = { fullName, email, password };
      const res = await signup(payload); // POST /api/auth/signup

      // Backend renvoie { error } en cas d'échec, { message } en succès
      if ('error' in res && res.error) {
        setErr(res.error);
        return;
      }

      setOk(res.message ?? 'Inscription réussie !');
      // Petite pause pour afficher le message puis redirection login
      setTimeout(() => router.replace('/authentication/login'), 800);
    } catch (e: any) {
      setErr(e?.message || 'Erreur réseau/serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-[#3FA9D9] text-2xl font-semibold mb-6">INSCRIPTION</h2>

      <p className="text-gray-600 mb-8">
        Bienvenue sur studyAI, veuillez remplir vos informations :
      </p>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Nom & Prénoms */}
        <div>
          <Label htmlFor="nompre" className="text-[#3FA9D9] mb-2 block">
            Nom & Prénoms
          </Label>
          <div className="relative">
            <Input
              id="nompre"
              type="text"
              placeholder="Gaspard Legrand"
              className="pr-10 bg-white text-gray-600 border-gray-300"
            />
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-[#3FA9D9] mb-2 block">
            Email
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
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

        {/* Confirmation Password */}
        <div>
          <PasswordInput label="Confirmer le Mot de passe" id="confirm-mot-password" />
        </div>

        {/* Messages */}
        {err && <p className="text-sm text-red-600">{err}</p>}
        {ok && <p className="text-sm text-emerald-600">{ok}</p>}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3FA9D9] hover:bg-[#2B7FB5] text-white"
        >
          {loading ? 'Création du compte…' : "S'inscrire"}
        </Button>
      </form>

      {/* Sign up link */}
      <p className="text-center mt-8 text-gray-700">
        Vous avez un compte ?{' '}
        <a href="/authentication/login" className="text-[#3FA9D9] hover:underline">
          Se connecter
        </a>
      </p>
    </div>
  );
}
