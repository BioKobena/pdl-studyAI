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
import {ClipboardList, FileText, MessageSquare} from "lucide-react";


const filesData = [
    { id: 1, name: "johndoe", hasSummary: true,  hasQuiz: true,  hasChat: true },
    { id: 2, name: "janesmith", hasSummary: true,  hasQuiz: false, hasChat: true },
    { id: 3, name: "bobwilson", hasSummary: false, hasQuiz: true,  hasChat: false },
    { id: 4, name: "sarahjones", hasSummary: true,  hasQuiz: true,  hasChat: false },
    { id: 5, name: "mikeanderson", hasSummary: false, hasQuiz: false, hasChat: true },
];


function WithVisibility() {

    return (
        <CardTable className="mx-auto my-6 w-full max-w-6xl">
            <CardTableHeader className="flex flex-row justify-between">
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
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filesData.map((file, index) => (
                            <TableRow key={index}>
                                <TableCell>{file.id}</TableCell>
                                <TableCell>
                                    <a href="#" className="font-medium">{file.name}</a>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {file.hasSummary && (
                                            <Button variant="outline" size="icon" title="Voir résumé">
                                                <FileText className="size-3.5" />
                                            </Button>
                                        )}
                                        {file.hasQuiz && (
                                            <Button variant="outline" size="icon" title="Voir quiz">
                                                <ClipboardList className="size-3.5" />
                                            </Button>
                                        )}
                                        {file.hasChat && (
                                            <Button variant="outline" size="icon" title="Poursuivre la conversation">
                                                <MessageSquare className="size-3.5" />
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
