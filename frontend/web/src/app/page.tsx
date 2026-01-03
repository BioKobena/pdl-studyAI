"use client";

import {Animation} from "@/component/ui/animation-robotAi";
import {CarouselDescription} from "@/component/ui/carousel-description";
import {Navbar} from "@/component/ui/navbar";
import FooterSection from "@/component/ui/footer";
import {Button} from "@/component/ui/button";
import {useRouter} from "next/navigation";

const testimonials = [
    {
        quote:
            "Téléverse ton document facilement et commence ton expérience StudyAI en un clic !",
        name: "Étape 1",
        designation: "Uploader ton fichier",
        src: "/carousel/upload-file.png",
    },
    {
        quote:
            "Génère automatiquement un résumé clair et précis de ton document pour gagner du temps.",
        name: "Étape 2",
        designation: "Générer le résumé",
        src: "/carousel/generate-summary.png",
    },
    {
        quote:
            "Crée un quiz basé sur ton document et teste tes connaissances de manière interactive.",
        name: "Étape 3",
        designation: "Générer le quiz",
        src: "/carousel/generate-quiz.png",
    },
    {
        quote:
            "Discute avec notre assistant pour poser des questions et approfondir ta compréhension.",
        name: "Étape 4",
        designation: "Chatter avec l'IA",
        src: "/carousel/chat.png",
    },
];


export default function LandingPage() {
    const router = useRouter();

    return (
        <div>
            <div id="top">
                {/* Navbar */}
                <Navbar/>
                {/* Contenu de la page */}
                <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
                    {/* Hero Section */}
                    <section
                        className="w-full flex flex-col-reverse lg:flex-row items-center justify-between py-16 px-4 lg:px-16 bg-white"
                    >
                        {/* Texte + boutons */}
                        <div className="flex-1 text-center lg:text-left lg:pr-12">
                            <h1 className="text-[#0A2540] lg:text-4xl mb-4 font-[var(--font-kufam-sans)] ">
                                Donne vie à tes documents avec <span className="text-[#00A6FB]">StudyAI</span>
                            </h1>

                            <p className="text-gray-700 text-lg sm:text-xl mb-8 max-w-lg mx-auto lg:mx-0 font-[var(--font-kufam-sans)]">
                                Upload un document et StudyAI génère automatiquement des résumés, des quiz et un assistant intelligent pour t’aider à étudier plus vite et mieux.
                            </p>

                            {/* Buttons existants */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-16">
                                <Button
                                    onClick={() => router.push("/authentication/login")}
                                    className="bg-[#3FA9D9] hover:bg-[#2B7FB5] text-white px-12 py-6 rounded-full min-w-[200px] font-[var(--font-kufam-sans)]"
                                >
                                    Connexion
                                </Button>
                                <Button
                                    onClick={() => router.push("/authentication/register")}
                                    className="bg-[#3FA9D9] hover:bg-[#2B7FB5] text-white px-12 py-6 rounded-full min-w-[200px] font-[var(--font-kufam-sans)]"
                                >
                                    Inscription
                                </Button>
                            </div>
                        </div>

                        {/* Illustration / visuel produit */}
                        <div className="flex-1 flex justify-center lg:justify-end mb-12 lg:mb-0">
                            <img
                                src="/welcome.png" // remplace par ton image / illustration
                                alt="Étudiant(e) utilisant StudyAI"
                                className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl rounded-xl shadow-lg"
                            />
                        </div>
                    </section>


                    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">

                        {/* Circular Testimonials */}
                        <section id="comment-ca-marche" className="w-full mt-32">
                            {/* Light testimonials section */}
                            <div
                                className="bg-[#f7f7fa] p-20 rounded-lg min-h-[300px] flex flex-wrap gap-6 items-center justify-center relative">
                                <div className="items-center justify-center relative flex" style={{maxWidth: "1456px"}}>
                                    <CarouselDescription
                                        testimonials={testimonials}
                                        autoplay={true}
                                        colors={{
                                            name: "#3FA9D9",
                                            designation: "#454545",
                                            testimony: "#171717",
                                            arrowBackground: "#141414",
                                            arrowForeground: "#f1f1f7",
                                            arrowHoverBackground: "#3FA9D9",
                                        }}
                                        fontSizes={{
                                            name: "28px",
                                            designation: "20px",
                                            quote: "20px",
                                        }}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* À propos de nous */}
                        <section id="a-propos" className="w-full bg-white py-24 px-6">
                            <div className="max-w-3xl mx-auto flex flex-col-reverse md:flex-row items-center">

                                {/* Animation à gauche */}
                                <div className="flex justify-center md:justify-start w-full md:w-1/2">
                                    <div className="relative">
                                        <div
                                            className="w-96 h-80 bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] rounded-full absolute top-0 left-1/2 -translate-x-1/2 opacity-60 blur-2xl"/>
                                        <div className="relative z-10">
                                            <Animation/>
                                        </div>
                                    </div>
                                </div>

                                {/* Texte à droite */}
                                <div className="w-full md:w-1/2 text-center md:text-left">
                                    <h2 className="text-3xl font-bold text-[#3FA9D9] mb-6 font-(family-name:--font-kufam-sans)">
                                        À propos de StudyAI
                                    </h2>

                                    <p className="text-gray-700 mb-4 leading-relaxed font-(family-name:--font-kufam-sans)">
                                        StudyAI est une plateforme intelligente conçue pour aider les étudiants
                                        à apprendre plus efficacement à partir de leurs propres documents.
                                    </p>

                                    <p className="text-gray-700 mb-4 leading-relaxed font-(family-name:--font-kufam-sans)">
                                        Grâce à l’intelligence artificielle, StudyAI transforme tes fichiers en
                                        résumés clairs, quiz interactifs et conversations intelligentes.
                                    </p>

                                    <p className="text-gray-700 leading-relaxed font-(family-name:--font-kufam-sans)">
                                        Notre objectif est simple : <strong>te faire gagner du temps</strong> et
                                        rendre l’apprentissage plus fluide, plus personnalisé et plus efficace.
                                    </p>
                                </div>

                            </div>
                            <div className="flex justify-end mt-12">
                                <a
                                    href="#top"
                                    aria-label="Retour en haut"
                                    className="flex items-center justify-center w-12 h-12 rounded-full
               bg-[#3FA9D9] text-white
               hover:bg-[#2B7FB5]
               transition-all duration-300
               shadow-lg"
                                >
                                    ↑
                                </a>
                            </div>
                        </section>

                    </div>
                </main>
                <FooterSection/>
            </div>
        </div>
    );
}
