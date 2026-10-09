import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { completeOnboarding } from "../api/onboardingApi";
import { useAuth } from "../auth/useAuth";

const plantCareInterests = [
  "Office plants",
  "Home plants",
  "Plant health tracking",
  "Watering reminders",
  "Plant identification",
];

type OnboardingPageProps = {
  onCompleted?: () => Promise<void>;
};

export function OnboardingPage({ onCompleted }: OnboardingPageProps) {
  const { account, getAccessToken } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(account?.name ?? "");
  const [team, setTeam] = useState("");
  const [interest, setInterest] = useState(plantCareInterests[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const accessToken = await getAccessToken();

      await completeOnboarding(accessToken, {
        displayName,
        email: account?.username ?? "",
        team,
        plantCareInterest: interest,
      });

      await onCompleted?.();

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to complete onboarding."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="page-section onboarding-page">
      <div className="onboarding-hero">
        <div>
          <p className="eyebrow">First-time setup</p>

          <h2>Welcome to HiPlant</h2>

          <p>
            Let&apos;s confirm a few details before you start caring for your
            plants. This onboarding flow is currently local-only and will later
            be saved through the backend.
          </p>
        </div>

        <div className="onboarding-illustration" aria-hidden="true">
          <img src="/plant-guardian.png" alt="" />
        </div>
      </div>

      <form className="onboarding-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field">
            <span>Display name</span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Your name"
              required
            />
          </label>

          <label className="form-field">
            <span>Email</span>
            <input value={account?.username ?? ""} readOnly />
          </label>

          <label className="form-field">
            <span>Team or department</span>
            <input
              value={team}
              onChange={(event) => setTeam(event.target.value)}
              placeholder="For example: Product, IT, Sales"
            />
          </label>

          <label className="form-field">
            <span>Main plant care interest</span>
            <select
              value={interest}
              onChange={(event) => setInterest(event.target.value)}
            >
              {plantCareInterests.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="onboarding-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Completing..." : "Complete onboarding"}
          </button>

          <p>
            Calls <code>POST /api/onboarding/complete</code>.
          </p>
        </div>

        {submitError && (
          <div className="error-message" role="alert">
            {submitError}
          </div>
        )}
      </form>
    </section>
  );
}