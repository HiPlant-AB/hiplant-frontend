export type OnboardingStatus =
  | "not_started"
  | "profile_required"
  | "approval_required"
  | "completed";

export type CurrentUser = {
  userId: string;
  displayName: string;
  email: string;
  onboardingStatus: OnboardingStatus;
  roles: string[];
};

export async function fetchCurrentUser(accessToken: string): Promise<CurrentUser> {
  const response = await fetch("/api/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load current user. Status: ${response.status}`);
  }

  return response.json() as Promise<CurrentUser>;
}