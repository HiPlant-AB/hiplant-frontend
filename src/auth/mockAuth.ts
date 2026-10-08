export type MockUser = {
  name: string;
  username: string;
  tenantId: string;
  localAccountId: string;
  roles: string[];
};

export const mockUser: MockUser = {
  name: "Claes Rosenberg",
  username: "claes.rosenberg@hiq.se",
  tenantId: "local",
  localAccountId: "local-claes",
  roles: ["Admin"],
};

export function isMockAuthEnabled(): boolean {
  return import.meta.env.VITE_AUTH_MODE === "mock";
}