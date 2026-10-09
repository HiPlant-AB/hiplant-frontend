import type { CurrentUser } from "./meApi";

export function fetchMockCurrentUser(): Promise<CurrentUser> {
  return Promise.resolve({
    userId: "local-claes",
    displayName: "Claes Rosenberg",
    email: "claes.rosenberg@hiq.se",
    onboardingStatus: "profile_required",
    roles: ["Admin"],
  });
}