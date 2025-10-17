'use client';

import Image from 'next/image';
import { Button } from '@/component/ui/button';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          {/* Title */}
          <h1 className="text-[#3FA9D9] mb-8 text-4xl font-bold">StudyAI</h1>

          {/* Welcome message */}
          <h2 className="text-[#3FA9D9] mb-8 text-2xl">Bonjour, bienvenue</h2>

          {/* Description */}
          <p className="text-gray-700 mb-12 max-w-lg mx-auto">
            Créé un compte pour sauvegarder tes quiz, ton historique et tes scores.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
                onClick={() => router.push('/authentication/login')}
                className="bg-[#3FA9D9] hover:bg-[#2B7FB5] text-white px-12 py-6 rounded-full min-w-[200px]"
            >
              Connexion
            </Button>
            <Button
                onClick={() => router.push('/authentication/login')}
                className="bg-[#3FA9D9] hover:bg-[#2B7FB5] text-white px-12 py-6 rounded-full min-w-[200px]"
            >
              Inscription
            </Button>
          </div>
          <div className="flex justify-center mt-16">
            <div className="relative">
              <div className="w-96 h-80 bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] rounded-full absolute top-0 left-1/2 -translate-x-1/2 opacity-60 blur-2xl"></div>

              <Image
                  src="/robotHomePage.png"
                  alt="Robot StudyAI"
                  width={300}
                  height={400}
                  className="relative z-10 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
  );
}
