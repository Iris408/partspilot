import { LOGIN_URL } from "./api"

export const DEMO_USERNAME = "partspilot"
export const DEMO_PASSWORD = "PartsPilotDemo2026!"

export async function authenticate(
  username: string,
  password: string
): Promise<string> {
  const formData = new URLSearchParams()

  formData.append("username", username)
  formData.append("password", password)

  const response = await fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded",
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Login failed")
  }

  const data = await response.json()

  const accessToken =
    data.access_token || data.token

  if (!accessToken) {
    throw new Error("No token returned")
  }

  return accessToken
}

// =========================================
// EN: Read the user role from the JWT payload
// JP: JWT ペイロードからユーザーロールを取得
//
// NOTE:
// This is used only for frontend UX.
// Backend authorization still protects write routes.
// =========================================

export function getTokenRole(
  token: string
): string | null {
  try {
    const payloadPart = token.split(".")[1]

    if (!payloadPart) {
      return null
    }

    const base64 = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/")

    const paddedBase64 = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      "="
    )

    const payload = JSON.parse(
      atob(paddedBase64)
    )

    return payload.role ?? null
  } catch {
    return null
  }
}