'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
import { Mail, User } from 'lucide-react';
import PasswordInput from "@/component/ui/password-input";
export default function LoginPage() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/dashboard/upload');
    };

    return (
        <div>
            <h2 className="text-[#3FA9D9] text-2xl font-semibold mb-6">INSCRIPTION</h2>

            <p className="text-gray-600 mb-8">
                Bienvenue sur studyAI, veuillez remplir vos informations :
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom&Prenoms */}
                <div>
                    <Label htmlFor="nom-prenoms" className="text-[#3FA9D9] mb-2 block">
                        Nom & Prénoms
                    </Label>
                    <div className="relative">
                        <Input
                            id="nompre"
                            type="input"
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
                    <PasswordInput label="Confirmer mot de passe" id="Confirmer-mot-password" />
                </div>


                {/* Submit button */}
                <Button
                    type="submit"
                    className="w-full bg-[#3FA9D9] hover:bg-[#2B7FB5] text-white"
                >
                    S&apos;inscrire
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
