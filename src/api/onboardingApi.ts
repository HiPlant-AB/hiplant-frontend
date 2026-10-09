import type { CurrentUser } from "./meApi";

export type CompleteOnboardingRequest = {
  displayName: string;
  email: string;
  team: string;
  plantCareInterest: string;
};

export async function completeOnboarding(
  accessToken: string,
  request: CompleteOnboardingRequest
): Promise<CurrentUser> {
  const response = await fetch("/api/onboarding/complete", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to complete onboarding. Status: ${response.status}`);
  }

  return response.json() as Promise<CurrentUser>;
}