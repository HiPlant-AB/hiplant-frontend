import { useAuth } from "../auth/useAuth";

export function HomePage() {
  const { account } = useAuth();

  return (
    <section className="page-section">
      <h2>Home</h2>

      <p>
        Welcome to HiPlant
        {account?.name ? `, ${account.name}` : ""}.
      </p>

      <p>
        This is the initial authenticated landing page. Later, this page can
        show plant dashboards, recent activity, or the user&apos;s default workspace.
      </p>
    </section>
  );
}