"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/component/ui/button";
import {
    CardTable,
    CardTableContent,
    CardTableDescription,
    CardTableHeader,
    CardTableTitle,
} from "@/component/ui/card-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/component/ui/table";
import { Eye, Trash } from "lucide-react";
import {Pagination, Upload} from "antd";
import { getUserSubjectsById, UserSubject } from "@/lib/api/userSubjectById";
import { getUser } from "@/lib/session";
import { deleteSubject } from "@/lib/api/subject"; // <- ton API delete
import { toast, Toaster } from "react-hot-toast";
import {InteractiveHoverButton} from "@/component/ui/interactive-button";

export default function DashboardPage() {
    const [subjects, setSubjects] = useState<UserSubject[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const router = useRouter();

    // Charger les sujets
    useEffect(() => {
        async function loadSubjects() {
            const user = getUser();
            if (!user?.id) return;

            try {
                const subjectsList = await getUserSubjectsById(user.id);
                setSubjects(subjectsList);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadSubjects();
    }, []);

    // Filtrer les sujets selon la recherche
    const filteredSubjects = useMemo(() => {
        if (!searchText.trim()) return subjects;
        return subjects.filter((s) =>
            s.title.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [subjects, searchText]);

    // Découpage pour la pagination
    const paginatedSubjects = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return filteredSubjects.slice(start, end);
    }, [filteredSubjects, currentPage, pageSize]);

    const handleView = (subject: UserSubject) => {
        const newWindow = window.open("", "_blank");
        if (newWindow) {
            newWindow.document.write(`
            <html>
                <head>
                    <title>${subject.title}</title>
                    <style>
                        body { 
                            font-family: sans-serif; 
                            padding: 20px; 
                            line-height: 1.5;
                        }
                        pre {
                            white-space: pre-wrap; /* respecte les retours à la ligne */
                            word-wrap: break-word; /* coupe les longues lignes */
                        }
                    </style>
                </head>
                <body>
                    <h1>${subject.title}</h1>
                    <pre>${subject.extract}</pre>
                </body>
            </html>
        `);
            newWindow.document.close();
        }
    };
    const handleOpenUploadSuccess = (subject: UserSubject) => {
        sessionStorage.setItem("curentSubjectId", subject.id);
        router.push("/dashboard/upload-success");
    };


    const handleDelete = (subjectId: string) => {
        // 1 afficher un toast de confirmation
        const confirmToast = toast(
            (t) => (
                <div className="flex flex-col gap-2">
                    <span>Voulez-vous vraiment supprimer ce fichier ?</span>
                    <div className="flex gap-2 justify-end mt-1">
                        <Button
                            className="bg-gray-200 hover:bg-gray-300"
                            onClick={() => toast.dismiss(t.id)}
                        >
                            Annuler
                        </Button>
                        <Button
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={async () => {
                                toast.dismiss(t.id); // fermer le toast
                                try {
                                    await deleteSubject(subjectId); // appeler l'API
                                    setSubjects((prev) =>
                                        prev.filter((s) => s.id !== subjectId)
                                    );
                                    toast.success("Fichier supprimé !");
                                } catch (error) {
                                    console.error(error);
                                    toast.error("Erreur lors de la suppression");
                                }
                            }}
                        >
                            Supprimer
                        </Button>
                    </div>
                </div>
            ),
            { duration: Infinity } // reste visible jusqu'à action
        );
    };

    if (loading) return <p>Chargement des documents...</p>;

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-end mb-4">
                <InteractiveHoverButton
                    text="Uploader un nouveau fichier"
                    href="/dashboard/upload"
                />
            </div>
            <Toaster position="top-right" /> {/* affichage des toasts */}

            {/* Tableau */}
            <CardTable className="mx-auto my-6 w-full max-w-6xl">
                <CardTableHeader>
                    <div className="flex items-center justify-between gap-4">
                        {/* Titre */}
                        <CardTableTitle>
                            Liste des documents téléchargés
                        </CardTableTitle>

                        {/* Barre de recherche */}
                        <input
                            type="text"
                            placeholder="Rechercher un fichier..."
                            className="border border-gray-300 rounded px-3 py-1 w-64"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    <CardTableDescription className="mt-2">
                        Visualisez et gérez vos documents, consultez le résumé, le quiz ou poursuivez la conversation avec l’IA.
                    </CardTableDescription>
                </CardTableHeader>

                <CardTableContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nom du fichier</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedSubjects.map((subject, index) => (
                                <TableRow
                                    key={subject.id}
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleOpenUploadSuccess(subject)}
                                >
                                    <TableCell>{index + 1 + (currentPage - 1) * pageSize}</TableCell>
                                    <TableCell>{subject.title}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <Button className="bg-slate-100 hover:bg-slate-200" onClick={() => handleView(subject)}><Eye className="w-4 h-4 text-[#3FA9D9]" /></Button>
                                            <Button className="bg-slate-100 hover:bg-slate-200" onClick={() => handleDelete(subject.id)}><Trash className="w-4 h-4 text-[#E53935]" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardTableContent>
            </CardTable>

            {/* Pagination */}
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredSubjects.length}
                showTotal={(total) => `Total ${total} items`}
                onChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                }}
                pageSizeOptions={[10, 20, 50, 100]}
                showSizeChanger
            />
        </div>
    );
}
