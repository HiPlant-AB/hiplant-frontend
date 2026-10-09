import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import type { CurrentUser } from "../api/meApi";
import { AccessDeniedPage } from "../pages/AccessDeniedPage";
import { HomePage } from "../pages/HomePage";
import { OnboardingPage } from "../pages/OnboardingPage";

type AppRoutesProps = {
  currentUser: CurrentUser | null;
  onOnboardingCompleted: () => Promise<void>;
};

export function AppRoutes({
  currentUser,
  onOnboardingCompleted,
}: AppRoutesProps) {
  const location = useLocation();

  if (!currentUser) {
    return null;
  }

  const isOnboardingCompleted = currentUser.onboardingStatus === "completed";
  const isOnboardingRoute = location.pathname === "/onboarding";
  const isAccessDeniedRoute = location.pathname === "/access-denied";

  if (!isOnboardingCompleted && !isOnboardingRoute && !isAccessDeniedRoute) {
    return <Navigate to="/onboarding" replace />;
  }

  if (isOnboardingCompleted && isOnboardingRoute) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/onboarding"
        element={<OnboardingPage onCompleted={onOnboardingCompleted} />}
      />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}