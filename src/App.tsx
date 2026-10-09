import { useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { isMockAuthEnabled } from "./auth/mockAuth";
import { useAuth } from "./auth/useAuth";
import { AccessDeniedPage } from "./pages/AccessDeniedPage";
import { HomePage } from "./pages/HomePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import "./App.css";

function App() {
  const { isAuthenticated, account, signIn, signOut, getAccessToken } = useAuth();
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
          <h1>HiPlant</h1>

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
          <h1>HiPlant</h1>
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
        <Link to="/">Home</Link>
        <Link to="/onboarding">Onboarding</Link>
        <Link to="/access-denied">Access denied</Link>
      </nav>

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

      <section className="content-card">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </section>
    </main>
  );
}

export default App;