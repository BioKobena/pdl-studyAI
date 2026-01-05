export interface UserSubject {
    id: string;
    title: string;
    extract: string;
}


export async function getUserSubjectsById(
    userId: string
): Promise<UserSubject[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8085";
    const token = localStorage.getItem("auth_token");

    if (!token) {
        throw new Error("No auth token found");
    }

    if (!userId) {
        throw new Error("UserId is required");
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


    return data.map((subject: any) => ({
        id: subject.id,
        title: subject.title,
        extract: subject.extractText,
    }));
}
