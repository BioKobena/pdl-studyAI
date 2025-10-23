"use client";

import { useState } from "react";
import React from "react";
import FileUpload, {
    DropZone,
    FileError,
    FileList,
    FileInfo,
    FileProgress,
} from "@/component/ui/file-uploader";
import { FileText, MessageCircle, GraduationCap } from "lucide-react";
import { HoverEffect } from "@/component/ui/hover-effect";

const projects = [
    {
        title: "Générer un résumé intelligent",
        description:
            "Obtenez un résumé clair et structuré de votre document pour réviser plus efficacement.",
        icon: <FileText size={40} />,
    },
    {
        title: "Discuter avec ton fichier",
        description:
            "Pose des questions à ton fichier et reçois des réponses précises comme si tu parlais à ton cours.",
        icon: <MessageCircle size={40} />,
    },
    {
        title: "Créer un quiz personnalisé",
        description:
            "Teste tes connaissances avec un quiz généré à partir du contenu de ton fichier.",
        icon: <GraduationCap size={40} />,
    },
];


export default function UploadFiles() {
    const [uploadFiles, setUploadFiles] = useState<FileInfo[]>([]);

    const onFileSelectChange = (files: FileInfo[]) => {
        setUploadFiles(files);
    };

    const onRemove = (fileId: string) => {
        setUploadFiles(uploadFiles.filter((file) => file.id !== fileId));
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
                            Dépose ton PDF
                        </h1>
                        <p className="text-muted-foreground">Révise plus vite.</p>
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

                {/* Section descriptive */}
                <div className="text-center mb-8 mt-10">
                    <h2 className="bg-[#89C4F4] text-white inline-block px-8 py-4 rounded">
                        CE QUE VOUS POUVEZ FAIRE ?
                    </h2>
                </div>

                {/* Cards section insérée ici */}
                <div className="mb-16">
                    <div className="max-w-5xl mx-auto px-8">
                        <HoverEffect items={projects} />
                    </div>
                </div>
            </main>
        </div>
    );
}
