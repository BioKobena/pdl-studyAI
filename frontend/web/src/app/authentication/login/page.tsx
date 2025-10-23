'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
import { Mail } from 'lucide-react';
import PasswordInput from "@/component/ui/password-input";

export default function LoginPage() {
    const router = useRouter();
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/dashboard/upload');
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

                {/* Forgot password */}
                <div className="text-right">
                    <a href="/authentication/reset-password" className="text-[#FF9966] text-sm hover:underline">
                        Mot de passe oublié ?
                    </a>
                </div>

                {/* Submit button */}
                <Button
                    type="submit"
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
