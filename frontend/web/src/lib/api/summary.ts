export async function summarizeExtractText() {

  const subjectId = localStorage.getItem("SubjectId");
  
  if (!subjectId) {
    console.error("Aucun Subject ID trouvé !");
    return;
  }
  console.log("")
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  try {
    const response = await fetch(`${base}/api/resume/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: JSON.stringify({ subjectId }),
    });


    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const summary = await response.json();
    console.log("Résumé :", summary);
    return summary;

  } catch (err: unknown) {
    if (err instanceof Error) console.error("Erreur résumé :", err.message);
    else console.error("Erreur résumé :", String(err));
  }
}
