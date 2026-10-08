import { useState } from "react";
import { isMockAuthEnabled } from "./auth/mockAuth";
import { useAuth } from "./auth/useAuth";
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

  return (
    <main className="app-shell">
      <section className="auth-card">
        <h1>HiPlant</h1>

        {isMockAuthEnabled() && (
          <div className="mock-auth-banner">
            Mock authentication is enabled for local development.
          </div>
        )}

        {!isAuthenticated && (
          <>
            <p>You are not signed in.</p>
            <button type="button" onClick={signIn}>
              Sign in with Microsoft
            </button>
          </>
        )}

        {isAuthenticated && (
          <>
            <p>You are signed in.</p>

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

            <div className="button-row">
              <button type="button" onClick={handleAcquireToken}>
                Acquire API token
              </button>

              <button type="button" onClick={signOut}>
                Sign out
              </button>
            </div>

            {tokenStatus && <p className="status-message">{tokenStatus}</p>}
          </>
        )}
      </section>
    </main>
  );
}

export default App;