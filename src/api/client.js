const API_URL = import.meta.env.VITE_API_URL || "https://pe-no-chao-backend-production.up.railway.app";

export async function analyzeText(text) {
  const resp = await fetch(`${API_URL}/api/v1/analyses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!resp.ok) {
    throw new Error("Erro na API");
  }

  return resp.json();
}