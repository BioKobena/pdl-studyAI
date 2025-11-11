export interface SubjectData {
    userId:string|null;
    title: string;
    extractText: string;
}

export async function createSubject(data: SubjectData) {
    // Get the auth token from localStorage
    const token = localStorage.getItem('auth_token');
    if (!token) {
        throw new Error("No auth token found. Please log in first.");
    }

    console.log("Token used for request:", token);

    // Make the API request with Authorization header
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subjects/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // pass the token here
        },
        body: JSON.stringify(data),
    });
    console.log("ceci est reponse",response)

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();

}
