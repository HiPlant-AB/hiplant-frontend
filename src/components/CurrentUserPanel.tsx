import type { CurrentUser } from "../api/meApi";

type CurrentUserPanelProps = {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
  onReload: () => Promise<void>;
};

export function CurrentUserPanel({
  currentUser,
  isLoading,
  error,
  onReload,
}: CurrentUserPanelProps) {
  return (
    <section className="account-panel">
      <div className="section-header">
        <h2>Application user</h2>

        <button type="button" onClick={onReload} disabled={isLoading}>
          {isLoading ? "Loading..." : "Reload /api/me"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {!error && isLoading && <p>Loading current user...</p>}

      {!error && !isLoading && !currentUser && (
        <p>No application user has been loaded yet.</p>
      )}

      {!error && !isLoading && currentUser && (
        <dl className="user-details">
          <dt>User ID</dt>
          <dd>{currentUser.userId}</dd>

          <dt>Display name</dt>
          <dd>{currentUser.displayName}</dd>

          <dt>Email</dt>
          <dd>{currentUser.email}</dd>

          <dt>Onboarding status</dt>
          <dd>{currentUser.onboardingStatus}</dd>

          <dt>Roles</dt>
          <dd>{currentUser.roles.join(", ") || "None"}</dd>
        </dl>
      )}
    </section>
  );
}