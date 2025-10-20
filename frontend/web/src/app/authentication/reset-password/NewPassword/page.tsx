'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
import { Mail, Eye } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/authentication/reset-password/ready');
    };

    return (
        <div>
            <h2 className="text-[#3FA9D9] text-2xl font-semibold mb-6">Créer un nouveau mot de passe</h2>

            <p className="text-gray-600 mb-8">
                Saisissez et confirmez votre nouveau mot de passe.       
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                    <Label htmlFor="email" className="text-[#3FA9D9] mb-2 block">
                        Nouveau mot de passe
                    </Label>
                     <div className="relative">
                        <Input
                            id="password"
                            type="password"
                            placeholder="Entrez votre mot de passe"
                            className="pr-10 bg-white text-gray-600 border-gray-300"
                        />
                        <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <Label htmlFor="password" className="text-[#3FA9D9] mb-2 block">
                        Confirmation du mot de passe 
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type="password"
                            placeholder="Entrez votre mot de passe"
                            className="pr-10 bg-white text-gray-600 border-gray-300"
                        />
                        <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {/* Submit button */}
                <Button
                    type="submit"
                    className="w-full bg-[#3FA9D9] hover:bg-[#2B7FB5] text-white"
                >
                    Continuer
                </Button>
            </form>

        </div>
    );
}
