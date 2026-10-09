import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../auth/useAuth";

const plantCareInterests = [
  "Office plants",
  "Home plants",
  "Plant health tracking",
  "Watering reminders",
  "Plant identification",
];

export function OnboardingPage() {
  const { account } = useAuth();

  const [displayName, setDisplayName] = useState(account?.name ?? "");
  const [team, setTeam] = useState("");
  const [interest, setInterest] = useState(plantCareInterests[0]);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
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
          <button type="submit">Complete onboarding</button>

          <p>
            Later this will call <code>POST /api/onboarding/complete</code>.
          </p>
        </div>

        {submitted && (
          <div className="success-message" role="status">
            Looks good. Onboarding would now be completed for{" "}
            <strong>{displayName || account?.username}</strong>.
          </div>
        )}
      </form>
    </section>
  );
}