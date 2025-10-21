'use client';

import { useState } from "react";
import React from "react";
import FileUpload, {
    DropZone,
    FileError,
    FileList,
    FileInfo,
    FileProgress,
} from "@/component/ui/file-uploader";
import { FileText, MessageCircle, HelpCircle } from "lucide-react";
import { HoverEffect } from "@/component/ui/hover-effect";
import MyIcon from "@/component/ui/icon";

export default function UploadFiles() {
    const [uploadFiles, setUploadFiles] = useState<FileInfo[]>([]);

    const onFileSelectChange = (files: FileInfo[]) => {
        setUploadFiles(files);
    };

    const onRemove = (fileId: string) => {
        setUploadFiles(uploadFiles.filter((file) => file.id !== fileId));
    };

    const items = [
        {
            title: "Résumé",
            description: "Générer un résumé pour mieux comprendre ton document.",
            link: "/resume",
            icon: <MyIcon/>,
        },
        {
            title: "Chat",
            description: "Discuter avec ton document et poser des questions.",
            link: "/chat",
            icon: <MyIcon/>,
        },
        {
            title: "Quiz",
            description: "Créer des quiz interactifs pour tester ta compréhension.",
            link: "/quiz",
            icon: <MyIcon/>,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Title */}
            <div className="text-center mb-8">
                <h1 className="text-red-700 text-3xl font-bold">Dépose ton pdf</h1>
                <p className="text-orange-500 text-md">Révise plus vite</p>
            </div>

            {/* Zone d’upload */}
            <main className="flex-1 container mx-auto px-4">
                <div className="w-full flex justify-center">
                    <div className="space-y-2 mb-6"></div>
                    <FileUpload
                        files={uploadFiles}
                        onFileSelectChange={onFileSelectChange}
                        multiple={true}
                        accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                        maxSize={10}
                        maxCount={3}
                        className="mt-2"
                        disabled={false}
                    >
                        <div className="space-y-4">
                            <DropZone prompt="Clique ou dépose ton fichier ici" />
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

                {/* 🟦 Infos Cards */}
                <div className="mt-12">
                    <HoverEffect items={items} />
                </div>
            </main>
        </div>
    );
}
