"use client";

import { Sidebar } from "@/component/ui/side-bar";
import { Button } from "@/component/ui/button";
import {
    CardTable,
    CardTableContent,
    CardTableDescription,
    CardTableHeader,
    CardTableTitle,
} from "@/component/ui/card-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/component/ui/table";
import { ClipboardList, FileText, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserSubjectsById, UserSubject } from "@/lib/api/userSubjectById";
import { getChatsBySubject, getQuizzesBySubject, getSummariesBySubject } from "@/lib/api/subjectActions";
import { getUser } from "@/lib/session";

interface SubjectWithActions extends UserSubject {
    summaries: any[];
    quizzes: any[];
    chats: any[];
}

function WithVisibility() {
    const [subjects, setSubjects] = useState<SubjectWithActions[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSubjects() {
            const user = getUser();
            if (!user?.id) return;

            try {
                const subjectsList = await getUserSubjectsById(user.id);

                const enrichedSubjects = await Promise.all(
                    subjectsList.map(async (subject) => {
                        const [summaries, quizzes, chats] = await Promise.all([
                            getSummariesBySubject(subject.id),
                            getQuizzesBySubject(subject.id),
                            getChatsBySubject(user.id, subject.id),
                        ]);
                        return { ...subject, summaries, quizzes, chats };
                    })
                );

                setSubjects(enrichedSubjects);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadSubjects();
    }, []);

    if (loading) return <p>Chargement des documents...</p>;

    return (
        <CardTable className="mx-auto my-6 w-full max-w-6xl">
            <CardTableHeader>
                <div className="space-y-2">
                    <CardTableTitle>Liste des documents téléchargés</CardTableTitle>
                    <CardTableDescription>
                        Visualisez et gérez vos documents, consultez le résumé, le quiz ou poursuivez la conversation avec l’IA.
                    </CardTableDescription>
                </div>
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
                        {subjects.map((subject, index) => (
                            <TableRow key={subject.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{subject.title}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {subject.summaries.length > 0 && (
                                            <Button>
                                                <FileText className="mr-2 w-4 h-4" />
                                                Voir résumé
                                            </Button>
                                        )}
                                        {subject.quizzes.length > 0 && (
                                            <Button>
                                                <ClipboardList className="mr-2 w-4 h-4" />
                                                Voir quiz
                                            </Button>
                                        )}
                                        {subject.chats.length > 0 && (
                                            <Button>
                                                <MessageSquare className="mr-2 w-4 h-4" />
                                                Poursuivre conv.
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardTableContent>
        </CardTable>
    );
}

export default function DashboardPage() {
    return (
        <div className="flex items-start">
            <Sidebar />
            <div className="flex-1 p-6">
                <WithVisibility />
            </div>
        </div>
    );
}
