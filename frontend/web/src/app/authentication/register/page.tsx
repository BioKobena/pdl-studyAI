'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
import { Mail, User } from 'lucide-react';
<<<<<<< HEAD
import { signup, type SignupRequest } from '@/lib/api/auth';

type Field = 'fullName' | 'email' | 'password' | 'confirm' | 'general';
type FieldErrors = Partial<Record<Field, string>>;

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

export default function RegisterPage() {
  const router = useRouter();

  // champs contrôlés
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);

  // --- Validations simples
  const validate = (partial = false) => {
    const e: FieldErrors = {};

    if (!partial || fullName) {
      if (!fullName.trim()) e.fullName = 'Nom & prénoms requis.';
    }
    if (!partial || email) {
      if (!email.trim()) e.email = 'Email requis.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email invalide.';
    }
    if (!partial || password) {
      if (!password) e.password = 'Mot de passe requis.';
      else if (password.length < 8) e.password = 'Au moins 8 caractères.';
    }
    if (!partial || confirm) {
      if (!confirm) e.confirm = 'Confirmation requise.';
      else if (confirm !== password) e.confirm = 'Les mots de passe ne correspondent pas.';
    }

    setErrors(prev => ({ ...prev, ...e }));
    return e;
  };

  const onBlurField = (f: Field) => {
    // validation légère champ par champ
    if (f === 'fullName') setErrors(s => ({ ...s, fullName: fullName.trim() ? '' : 'Nom & prénoms requis.' }));
    if (f === 'email') {
      const err = !email.trim()
        ? 'Email requis.'
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? 'Email invalide.'
        : '';
      setErrors(s => ({ ...s, email: err }));
    }
    if (f === 'password') {
      const err = !password ? 'Mot de passe requis.' : password.length < 8 ? 'Au moins 8 caractères.' : '';
      setErrors(s => ({ ...s, password: err }));
    }
    if (f === 'confirm') {
      const err = !confirm ? 'Confirmation requise.' : confirm !== password ? 'Les mots de passe ne correspondent pas.' : '';
      setErrors(s => ({ ...s, confirm: err }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk(null);
    setErrors({}); // reset

    const eAll = validate(); // validation complète
    if (Object.values(eAll).some(Boolean)) return;

    setLoading(true);
    try {
      const payload: SignupRequest = { fullName: fullName.trim(), email: email.trim(), password };
      const res = await signup(payload);

      // Si le back renvoie { error } ou { fieldErrors: { email: ... } }
      const anyRes: any = res;
      if ((anyRes && anyRes.error) || (anyRes && anyRes.fieldErrors)) {
        setErrors({
          general: anyRes.error ?? '',
          ...anyRes.fieldErrors,
        });
=======
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
>>>>>>> d4dc2c874b9c19afd1141d330adc18d395eaeca8
        return;
      }

      setOk(res.message ?? 'Inscription réussie !');
<<<<<<< HEAD
      setTimeout(() => router.replace('/authentication/login'), 800);
    } catch (err: any) {
      // si le serveur renvoie HTML (DOCTYPE...), on masque par un message propre
      setErrors({ general: 'Erreur serveur. Réessayez dans un instant.' });
=======
      // Petite pause pour afficher le message puis redirection login
      setTimeout(() => router.replace('/authentication/login'), 800);
    } catch (e: any) {
      setErr(e?.message || 'Erreur réseau/serveur');
>>>>>>> d4dc2c874b9c19afd1141d330adc18d395eaeca8
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-[#3FA9D9] text-2xl font-semibold mb-6">INSCRIPTION</h2>
<<<<<<< HEAD
      <p className="text-gray-600 mb-8">Bienvenue sur StudyAI, veuillez remplir vos informations :</p>
=======

      <p className="text-gray-600 mb-8">
        Bienvenue sur studyAI, veuillez remplir vos informations :
      </p>
>>>>>>> d4dc2c874b9c19afd1141d330adc18d395eaeca8

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Nom & Prénoms */}
        <div>
<<<<<<< HEAD
          <Label htmlFor="nompre" className="text-[#3FA9D9] mb-2 block">Nom & Prénoms</Label>
=======
          <Label htmlFor="nompre" className="text-[#3FA9D9] mb-2 block">
            Nom & Prénoms
          </Label>
>>>>>>> d4dc2c874b9c19afd1141d330adc18d395eaeca8
          <div className="relative">
            <Input
              id="nompre"
              type="text"
              placeholder="Gaspard Legrand"
<<<<<<< HEAD
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              onBlur={() => onBlurField('fullName')}
              aria-invalid={!!errors.fullName}
              aria-describedby="nompre-error"
              className={cn(
                'pr-10 bg-white text-gray-600',
                errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-[#3FA9D9]'
              )}
            />
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.fullName && <p id="nompre-error" className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
=======
              className="pr-10 bg-white text-gray-600 border-gray-300"
            />
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
>>>>>>> d4dc2c874b9c19afd1141d330adc18d395eaeca8
        </div>

        {/* Email */}
        <div>
<<<<<<< HEAD
          <Label htmlFor="email" className="text-[#3FA9D9] mb-2 block">Email</Label>
=======
          <Label htmlFor="email" className="text-[#3FA9D9] mb-2 block">
            Email
          </Label>
>>>>>>> d4dc2c874b9c19afd1141d330adc18d395eaeca8
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="groupepedistic@gmail.com"
<<<<<<< HEAD
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => onBlurField('email')}
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
            onBlur={() => onBlurField('password')}
            aria-invalid={!!errors.password}
            aria-describedby="pwd-error"
            className={cn(
              'bg-white text-gray-600',
              errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-[#3FA9D9]'
            )}
          />
          {errors.password && <p id="pwd-error" className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        {/* Confirmer le mot de passe */}
        <div>
          <Label htmlFor="confirm-mot-password" className="text-[#3FA9D9] mb-2 block">Confirmer le Mot de passe</Label>
          <Input
            id="confirm-mot-password"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            onBlur={() => onBlurField('confirm')}
            aria-invalid={!!errors.confirm}
            aria-describedby="confirm-error"
            className={cn(
              'bg-white text-gray-600',
              errors.confirm ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-[#3FA9D9]'
            )}
          />
          {errors.confirm && <p id="confirm-error" className="mt-1 text-xs text-red-600">{errors.confirm}</p>}
        </div>

        {/* Messages globaux */}
        {errors.general && <p className="text-sm text-red-600">{errors.general}</p>}
        {ok && <p className="text-sm text-emerald-600">{ok}</p>}

        <Button type="submit" disabled={loading} className="w-full bg-[#3FA9D9] hover:bg-[#2B7FB5] text-white">
=======
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
>>>>>>> d4dc2c874b9c19afd1141d330adc18d395eaeca8
          {loading ? 'Création du compte…' : "S'inscrire"}
        </Button>
      </form>

<<<<<<< HEAD
      <p className="text-center mt-8 text-gray-700">
        Vous avez un compte ?{' '}
        <a href="/authentication/login" className="text-[#3FA9D9] hover:underline">Se connecter</a>
=======
      {/* Sign up link */}
      <p className="text-center mt-8 text-gray-700">
        Vous avez un compte ?{' '}
        <a href="/authentication/login" className="text-[#3FA9D9] hover:underline">
          Se connecter
        </a>
>>>>>>> d4dc2c874b9c19afd1141d330adc18d395eaeca8
      </p>
    </div>
  );
}
