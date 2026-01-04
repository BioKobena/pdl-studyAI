const token = localStorage.getItem("auth_token");
const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8085";

async function fetchWithAuth(url: string) {
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return [];
    return await res.json();
}

// Résumé
export async function getSummariesBySubject(subjectId: string) {
    const url = `${base}/api/resume/subject/${subjectId}`;
    return fetchWithAuth(url);
}

// Quiz
export async function getQuizzesBySubject(subjectId: string) {
    const url = `${base}/quiz/subject/${subjectId}`;
    return fetchWithAuth(url);
}

// Chat (ici on a besoin du userId)
export async function getChatsBySubject(userId: string | undefined, subjectId: string) {
    const url = `${base}/chat/conversation?userId=${userId}&subjectId=${subjectId}`;
    return fetchWithAuth(url);
}
