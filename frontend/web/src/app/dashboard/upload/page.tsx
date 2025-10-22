'use client';

import { useState } from "react";
import { Card } from "@/component/ui/card";
import { Facebook, Twitter, Linkedin, GraduationCap } from "lucide-react";
import React from "react";
import FileUpload, { DropZone, FileError, FileList, FileInfo, FileProgress } from "@/component/ui/file-uploader";

export default function UploadFiles() {
    const [uploadFiles, setUploadFiles] = useState<FileInfo[]>([]);

    const onFileSelectChange = (files: FileInfo[]) => {
        setUploadFiles(files);
    };

    const onRemove = (fileId: string) => {
        setUploadFiles(uploadFiles.filter(file => file.id !== fileId));
    };

    const getFileIcon = (type: string) => {
        if (type === "pdf") return "text-red-500";
        else if (type === "docx" || type === "doc") return "text-blue-500";
        else return "text-gray-500";
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">

                {/* Upload Area */}
                <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="space-y-2 mb-6">
                        <h1 className="text-2xl font-bold tracking-tight text-red-700 mb-2">
                            Dépose ton pdf
                        </h1>
                        <p className="text-muted-foreground">
                            Révise plus vite.
                        </p>
                    </div>

                    {/* File Upload */}
                    <FileUpload
                        files={uploadFiles}
                        onFileSelectChange={onFileSelectChange}
                        multiple={false}
                        accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                        maxSize={10}
                        maxCount={1}
                        className="mt-2"
                        disabled={false}
                    >
                        <div className="space-y-4">
                            <DropZone prompt="click or drop, 3 file to upload" />
                            <FileError />
                            <FileProgress />
                            <FileList
                                files={uploadFiles}
                                onClear={() => setUploadFiles([])}
                                onRemove={onRemove}
                                canResume={true}
                            />
                        </div>
                    </FileUpload>

                </div>

                {/* Action Cards */}
                <div className="text-center mb-8">
                    <h2 className="bg-blue-400 text-white inline-block px-8 py-2 rounded">
                        CE QUE VOUS POUVEZ FAIRE ?
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Resume Card */}
                    <Card className="bg-gradient-to-b from-blue-400 to-blue-500 text-white p-6 text-center">
                        <h3 className="mb-3">RESUME</h3>
                        <p className="text-sm mb-6 opacity-90">
                            Générer un résumé du texte complet ou même comprendre les concepts clés
                        </p>
                        <div className="flex justify-center">
                            <div className="w-20 h-24 border-2 border-white rounded flex items-center justify-center">
                                <div className="space-y-1">
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                </div>
                            </div>
                            <div className="w-20 h-24 border-2 border-white rounded ml-2 flex items-center justify-center">
                                <div className="space-y-1">
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Quizz Card */}
                    <Card className="bg-gradient-to-b from-blue-400 to-blue-500 text-white p-6 text-center">
                        <h3 className="mb-3">QUIZZ</h3>
                        <p className="text-sm mb-6 opacity-90">
                            Générer un quiz qui vous permettra de tester vos connaissances
                        </p>
                        <div className="flex justify-center">
                            <div className="w-20 h-24 border-2 border-white rounded flex items-center justify-center">
                                <div className="space-y-1">
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                </div>
                            </div>
                            <div className="w-20 h-24 border-2 border-white rounded ml-2 flex items-center justify-center">
                                <div className="space-y-1">
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Chat Card */}
                    <Card className="bg-gradient-to-b from-blue-400 to-blue-500 text-white p-6 text-center">
                        <h3 className="mb-3">CHAT</h3>
                        <p className="text-sm mb-6 opacity-90">
                            Poser des questions pour mieux comprendre des concepts
                        </p>
                        <div className="flex justify-center">
                            <div className="w-20 h-24 border-2 border-white rounded flex items-center justify-center">
                                <div className="space-y-1">
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                </div>
                            </div>
                            <div className="w-20 h-24 border-2 border-white rounded ml-2 flex items-center justify-center">
                                <div className="space-y-1">
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                    <div className="h-1 w-8 bg-white rounded"></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-start gap-2">
                            <GraduationCap className="w-6 h-6 text-blue-500" />
                            <div>
                                <h3 className="text-blue-500">StudyAI</h3>
                                <p className="text-red-600 text-sm mt-1">Démarrez avec une autre</p>
                                <p className="text-red-600 text-sm">vision des révisions.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <a href="#" className="text-red-600 hover:underline">Accueil</a>
                            <a href="#" className="text-red-600 hover:underline">Invitez vos amis</a>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <p className="text-sm text-gray-600">
                            © 2025 StudyAI. Tous droits réservés
                        </p>
                        <div className="flex items-center gap-3">
                            <a href="#" className="text-blue-600 hover:text-blue-700">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-blue-400 hover:text-blue-500">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-blue-700 hover:text-blue-800">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
