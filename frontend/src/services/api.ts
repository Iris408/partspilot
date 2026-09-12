const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8001"
).replace(/\/+$/, "")

export const LOGIN_URL = `${API_URL}/auth/login`

export function getAuthHeaders(): HeadersInit {
  const storedToken = localStorage.getItem("TOKEN_STORAGE_KEY")

  if (!storedToken) {
    throw new Error("Authentication token is missing")
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${storedToken}`,
  }
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  if (response.status === 401) {
    localStorage.removeItem("TOKEN_STORAGE_KEY")
    throw new Error("Unauthorized")
  }

  return response
}