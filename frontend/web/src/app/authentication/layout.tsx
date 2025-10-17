'use client';

import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            {/* --- Partie gauche : fond bleu + logo textuel + robot --- */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#3FA9D9] to-[#2B7FB5] items-center justify-center relative">
                <div className="text-center flex flex-col items-center gap-6">
                    {/* Logo textuel */}
                    <Image
                        src="/studyAIText.png"
                        alt="Logo StudyAI"
                        width={200}
                        height={60}
                        className="object-contain"
                    />

                    {/* Image du robot */}
                    <Image
                        src="/robot.png"
                        alt="Robot StudyAI"
                        width={500}
                        height={500}
                        className="object-contain"
                    />
                </div>
            </div>

            {/* --- Partie droite : contenu dynamique (login/register) --- */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[#F5F5F5]">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
