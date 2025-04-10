import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "@/layout/AppLayout.jsx";
import { AuthRedirect, ProtectedRoute } from "@/secure/ProtectedRoute.jsx";
import LoaderSpinner from "@/utils/LoaderSpinner.jsx";
import ProtectTokenBackend from "./secure/ProtectTokenBackend";
import ProtectCheckCredit from "./secure/ProtectCheckCredit";
// import SubscribePage from "@/pages/SubscribePage";

const HomePage = lazy(() => import("@/pages/HomePage.jsx"));
const CreatePodCastPage = lazy(() => import("@/pages/CreatePodCastPage.jsx"));
const DiscoverPage = lazy(() => import("@/pages/DiscoverPage.jsx"));
const EmailVerificationPage = lazy(() =>
  import("@/pages/EmailVerificationPage.jsx")
);
const SignUpPage = lazy(() => import("@/pages/SignUpPage.jsx"));
const SignInPage = lazy(() => import("@/pages/SignInPage.jsx"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage.jsx"));
const PasswordResetPage = lazy(() => import("@/pages/PasswordResetPage.jsx"));
const MyProfilePage = lazy(() => import("@/pages/MyProfilePage.jsx"));
const PodCastDetailPage = lazy(() => import("@/pages/PodCastDetailPage.jsx"));
const PodcasterProfile = lazy(() => import("@/pages/PodcasterProfile"));
const SubscribePage = lazy(()=> import("@/pages/SubscribePage"));

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoaderSpinner />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/create-podcast"
          element={
            <ProtectTokenBackend>
              <ProtectedRoute>
                <ProtectCheckCredit>
                  <Suspense fallback={<LoaderSpinner />}>
                    <CreatePodCastPage />
                  </Suspense>
                </ProtectCheckCredit>
              </ProtectedRoute>
            </ProtectTokenBackend>
          }
        />
        <Route
          path="/sign-in"
          element={
            <AuthRedirect>
              <Suspense fallback={<LoaderSpinner />}>
                <SignInPage />
              </Suspense>
            </AuthRedirect>
          }
        />
        <Route
          path="/sign-up"
          element={
            <AuthRedirect>
              <Suspense fallback={<LoaderSpinner />}>
                <SignUpPage />
              </Suspense>
            </AuthRedirect>
          }
        />
        <Route
          path="/discover"
          element={
            <ProtectTokenBackend>
              <ProtectedRoute>
                <Suspense fallback={<LoaderSpinner />}>
                  <DiscoverPage />
                </Suspense>
              </ProtectedRoute>
            </ProtectTokenBackend>
          }
        />
        <Route
          path="/email-verify"
          element={
            <AuthRedirect>
              <Suspense fallback={<LoaderSpinner />}>
                <EmailVerificationPage />
              </Suspense>
            </AuthRedirect>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRedirect>
              <Suspense fallback={<LoaderSpinner />}>
                <ForgotPasswordPage />
              </Suspense>
            </AuthRedirect>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <AuthRedirect>
              <Suspense fallback={<LoaderSpinner />}>
                <PasswordResetPage />
              </Suspense>
            </AuthRedirect>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectTokenBackend>
              <ProtectedRoute>
                <Suspense fallback={<LoaderSpinner />}>
                  <MyProfilePage />
                </Suspense>
              </ProtectedRoute>
            </ProtectTokenBackend>
          }
        />
        <Route
          path="/edit-podcast-page/:podcastId"
          element={
            <ProtectTokenBackend>
              <ProtectedRoute>
                <Suspense fallback={<LoaderSpinner />}>
                  <CreatePodCastPage />
                </Suspense>
              </ProtectedRoute>
            </ProtectTokenBackend>
          }
        />
        <Route
          path="/podcast-details/:podcastId"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoaderSpinner />}>
                <PodCastDetailPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/podcaster-profile/:userId"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoaderSpinner />}>
                <PodcasterProfile />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscribe"
          element={
            <Suspense fallback={<LoaderSpinner />}>
              <SubscribePage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
