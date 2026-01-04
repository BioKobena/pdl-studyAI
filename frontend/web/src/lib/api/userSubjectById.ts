export interface UserSubject {
    id: string;
    title: string;
    createdAt: string;
    latestSummary?: any;
    latestQuiz?: any;
    latestChat?: any;
}


export async function getUserSubjectsById(userId: string | undefined): Promise<UserSubject[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8085";
    const token = localStorage.getItem("auth_token");

    if (!token) {
        throw new Error("No auth token found");
    }

    const response = await fetch(`${base}/api/subjects/user/${userId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Tri du plus récent au plus ancien
    return data
        .sort(
            (a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((subject: any) => ({
            id: subject.id,
            title: subject.title,
            createdAt: subject.createdAt,
        }));
}
