import { useAuth } from "../auth/useAuth";

export function OnboardingPage() {
  const { account } = useAuth();

  return (
    <section className="page-section">
      <h2>Onboarding</h2>

      <p>
        This page will guide a first-time user through any required setup before
        they can use the application.
      </p>

      <dl className="user-details">
        <dt>User</dt>
        <dd>{account?.name ?? "Unknown"}</dd>

        <dt>Email</dt>
        <dd>{account?.username ?? "Unknown"}</dd>
      </dl>

      <p>
        Later, this page can collect required profile information, show pending
        approval status, or confirm that the user has accepted relevant terms.
      </p>
    </section>
  );
}