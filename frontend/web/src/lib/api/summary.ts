export async function summarizeExtractText(subjectId: string) {
  if (!subjectId) {
    console.error("Aucun Subject ID fourni !");
    return;
  }

  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("No auth token found. Please log in first.");

  const response = await fetch(`${base}/api/resume/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subjectId }),
  });

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return await response.json();
}


export async function getSummary(subjectId: string): Promise<any | null> {
  if (!subjectId) return null;

  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("No auth token found. Please log in first.");

  try {
    const res = await fetch(`${base}/api/subject/${subjectId}/resume`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 404) return null; // pas de résumé existant
      throw new Error(`Erreur GET Résumé: ${res.status}`);
    }

    return await res.json();
  } catch (e) {
    console.error("getSummary error:", e);
    return null;
  }
}

