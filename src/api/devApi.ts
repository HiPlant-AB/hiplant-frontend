import type { CurrentUser } from "./meApi";

export async function resetDevState(accessToken: string): Promise<CurrentUser> {
  const response = await fetch("/api/dev/reset", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to reset dev state. Status: ${response.status}`);
  }

  return response.json() as Promise<CurrentUser>;
}