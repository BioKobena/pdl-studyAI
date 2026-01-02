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
