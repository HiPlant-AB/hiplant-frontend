import { useState } from "react";
import { isMockAuthEnabled } from "./auth/mockAuth";
import { useAuth } from "./auth/useAuth";
import { CurrentUserPanel } from "./components/CurrentUserPanel";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "./api/useCurrentUser";
import { AppRoutes } from "./components/AppRoutes";
import { BrandLogo } from "./components/BrandLogo";
import "./App.css";

function App() {
  const { isAuthenticated, account, signIn, signOut, getAccessToken } = useAuth();
  const {
    currentUser,
    isLoading: isCurrentUserLoading,
    error: currentUserError,
    reload: reloadCurrentUser,
  } = useCurrentUser();
  const [tokenStatus, setTokenStatus] = useState<string | null>(null);

  async function handleAcquireToken() {
    setTokenStatus(null);

    try {
      const token = await getAccessToken();

      console.log("Access token:", token);
      setTokenStatus("Access token acquired. Check the browser console.");
    } catch (error) {
      console.error(error);
      setTokenStatus(error instanceof Error ? error.message : "Failed to acquire access token.");
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="app-shell">
        <section className="auth-card">
          <BrandLogo />

          {isMockAuthEnabled() && (
            <div className="mock-auth-banner">
              Mock authentication is enabled for local development.
            </div>
          )}

          <p>You are not signed in.</p>

          <button type="button" onClick={signIn}>
            Sign in with Microsoft
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-layout">
      <header className="app-header">
        <div>
          <BrandLogo />
          <p>
            Signed in as <strong>{account?.name ?? account?.username ?? "Unknown"}</strong>
          </p>
        </div>

        <button type="button" onClick={signOut}>
          Sign out
        </button>
      </header>

      {isMockAuthEnabled() && (
        <div className="mock-auth-banner app-banner">
          Mock authentication is enabled for local development.
        </div>
      )}

      <nav className="app-nav" aria-label="Main navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          Home
        </NavLink>

        <NavLink
          to="/onboarding"
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          Onboarding
        </NavLink>

        <NavLink
          to="/access-denied"
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          Access denied
        </NavLink>
      </nav>

      <section className="content-card">
        {isCurrentUserLoading && <p>Loading application user...</p>}

        {currentUserError && (
          <p className="error-message">
            Could not load application user. Routing decisions are paused.
          </p>
        )}

        {!isCurrentUserLoading && !currentUserError && (
          <AppRoutes currentUser={currentUser} />
        )}
      </section>

      <section className="debug-panels">
        <section className="account-panel">
          <h2>Current account</h2>

          <dl className="user-details">
            <dt>Name</dt>
            <dd>{account?.name ?? "Unknown"}</dd>

            <dt>Username</dt>
            <dd>{account?.username ?? "Unknown"}</dd>

            <dt>Tenant ID</dt>
            <dd>{account?.tenantId ?? "Unknown"}</dd>

            <dt>Local account ID</dt>
            <dd>{account?.localAccountId ?? "Unknown"}</dd>

            <dt>Roles</dt>
            <dd>{account?.roles?.join(", ") || "None"}</dd>
          </dl>

          <button type="button" onClick={handleAcquireToken}>
            Acquire API token
          </button>

          {tokenStatus && <p className="status-message">{tokenStatus}</p>}
        </section>

        <CurrentUserPanel
          currentUser={currentUser}
          isLoading={isCurrentUserLoading}
          error={currentUserError}
          onReload={reloadCurrentUser}
        />
      </section>

    </main >
  );
}

export default App;