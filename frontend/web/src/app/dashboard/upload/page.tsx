'use client';

import { Upload, FileText, File } from 'lucide-react';
import { Button } from '@/component/ui/button';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
    const router = useRouter();

    const recentFiles = [
        { name: 'cours_base_de_donnees.pdf', size: '18 Mo', type: 'pdf', icon: 'pdf' },
        { name: 'cours_base_de_donnees.docx', size: '18 Mo', type: 'docx', icon: 'docx' },
        { name: 'cours_base_de_donnees.txt', size: '18 Mo', type: 'txt', icon: 'txt' },
        { name: 'cours_base_de_donnees.pdf', size: '18 Mo', type: 'pdf', icon: 'pdf' },
        { name: 'cours_base_de_donnees.pdf', size: '18 Mo', type: 'pdf', icon: 'pdf' },
        { name: 'cours_modelisation_ensemble.txt', size: '18 Mo', type: 'txt', icon: 'txt' }
    ];

    const getFileIcon = (type: string) => {
        const iconClass = "w-5 h-5";
        switch(type) {
            case 'pdf':
                return <FileText className={`${iconClass} text-red-500`} />;
            case 'docx':
                return <FileText className={`${iconClass} text-blue-500`} />;
            case 'txt':
                return <File className={`${iconClass} text-gray-500`} />;
            default:
                return <File className={iconClass} />;
        }
    };

    const getFileColor = (type: string) => {
        switch(type) {
            case 'pdf':
                return 'bg-red-100';
            case 'docx':
                return 'bg-blue-100';
            case 'txt':
                return 'bg-gray-100';
            default:
                return 'bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5]">

            {/* Main content */}
            <main className="container mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left side - Upload area */}
                    <div>
                        <div className="bg-white rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                            <div className="text-center">
                                {/* Upload icon */}
                                <div className="mb-6">
                                    <div className="w-32 h-32 mx-auto border-4 border-dashed border-[#3FA9D9] rounded-lg flex items-center justify-center">
                                        <Upload className="w-16 h-16 text-[#3FA9D9]" strokeWidth={1.5} />
                                    </div>
                                </div>

                                {/* Upload button */}
                                <Button className="bg-[#3FA9D9] hover:bg-[#2B7FB5] text-white mb-4">
                                    Uploader son pdf
                                </Button>

                                {/* Accepted formats */}
                                <p className="text-gray-500 text-sm">
                                    Fichier accepté : .pdf, .txt, .docs, .docx
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Recent files */}
                    <div>
                        <h3 className="mb-6 text-gray-700">Fichier récemment uploadé :</h3>

                        <div className="space-y-3">
                            {recentFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="bg-[#A8D5E2] hover:bg-[#95C8D8] transition-colors rounded-lg p-4 flex items-center justify-between cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* File icon */}
                                        <div className={`w-10 h-10 ${getFileColor(file.type)} rounded flex items-center justify-center`}>
                                            {getFileIcon(file.type)}
                                        </div>

                                        {/* File name */}
                                        <span className="text-white">{file.name}</span>
                                    </div>

                                    {/* File size */}
                                    <span className="text-white">{file.size}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
