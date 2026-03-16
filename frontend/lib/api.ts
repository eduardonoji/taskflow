const API_URL = "http://localhost:3000";

export async function apiFetch(path: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Erro na API");
  }

  return response.json();
}