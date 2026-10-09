import { useAuth } from "../auth/useAuth";

export function HomePage() {
  const { account } = useAuth();

  return (
    <section className="page-section hero-section">
      <div>
        <p className="eyebrow">Plant care dashboard</p>

        <h2>
          Good morning
          {account?.name ? `, ${account.name.split(" ")[0]}` : ""}.
        </h2>

        <p>
          Your plants are looking happy. This placeholder page will later show
          your plant overview, care reminders, and onboarding status.
        </p>
      </div>

      <div className="hero-badge">
        <span className="hero-badge__dot" />
        Local prototype
      </div>
    </section>
  );
}