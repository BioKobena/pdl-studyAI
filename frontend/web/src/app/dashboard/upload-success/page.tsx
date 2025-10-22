'use client';

import { useState } from 'react';
import { FileText, Pencil, MessageCircle, ClipboardList } from 'lucide-react';
import OptionButton from "../../../component/ui/option-button";

export default function UploadSuccess() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            setUploadedFile(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setUploadedFile(files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-6 py-5">
                {/* Title Section */}
                <div className="text-center mb-4">
                    <p className="text-2xl text-[#3FA9D9]">Révise plus vite</p>
                </div>

                {/* Upload Area */}
                <div
                    className={`mb-10 border-2 rounded-lg p-8 transition-colors ${isDragging ? 'border-[#3FA9D9] bg-blue-50' : ' bg-white'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center justify-center gap-2">
                        {/* PDF Icon */}
                        <div className="relative w-32 h-32">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-24 h-28 bg-white border border-gray-300 rounded-lg shadow-md flex flex-col items-center justify-center overflow-hidden">
                                    <div className="flex-1 flex items-center justify-center">
                                        <FileText className="w-12 h-12 text-[#c94a4a]" />
                                    </div>
                                    <div className="bg-[#c94a4a] w-full py-2 text-white text-center">
                                        PDF
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* File name or upload prompt */}
                        {uploadedFile ? (
                            <p className="text-[#8b0000]">{uploadedFile.name}</p>
                        ) : (
                            <>
                                <p className="text-[#8b0000]">cours_base_de_donnees.pdf</p>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileInput}
                                    className="hidden"
                                    id="file-upload"
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Options Section */}
                <div className="flex flex-col items-center justify-center min-h-screenspace-y-6">
                    <h2 className="text-2xl text-gray-700">
                        Commençons votre révision, choisissez une option :
                    </h2>

                    <div className="flex flex-wrap gap-6 justify-center mt-8">
                        <OptionButton icon="/resume.png" label="Résumé" />
                        <OptionButton icon="/chat.png" label="Chat" />
                        <OptionButton icon="/quizz.png" label="Quizz" />
                    </div>
                </div>
            </main>
        </div>
    );
}
