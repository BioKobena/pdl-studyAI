export interface SubjectData {
  userId: string | null;
  title: string;
  extractText: string;
}

export async function createSubject(data: SubjectData) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("No auth token found. Please log in first.");
  }

  const response = await fetch(`${base}/api/subjects/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return await response.json();
}


export async function deleteSubject(subjectId: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("No auth token found. Please log in first.");
  }

  const response = await fetch(`${base}/api/subjects/${subjectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return await response.json();
}
