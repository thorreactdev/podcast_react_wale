import { Link, Outlet, useLocation } from "react-router-dom";
import LeftSideBar from "@/components/LeftSideBar.jsx";
import RightSideBar from "@/components/RightSideBar.jsx";
import MobileNav from "@/components/MobileNav.jsx";
import { Toaster } from "@/components/ui/toaster.jsx";
import PodcastPlayer from "@/components/PodcastPlayer";

// eslint-disable-next-line react/prop-types
function AppLayout({ children }) {
  const location = useLocation();

  // Check if the current route is `/sign-in` or `/sign-up` or `/verify-email`
  const isAuthPage =
    [
      "/sign-in",
      "/sign-up",
      "/email-verify",
      "/forgot-password",
      "/subscribe",
    ].includes(location.pathname) ||
    location?.pathname?.startsWith("/reset-password");
  if (isAuthPage) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Toaster />
        <Outlet />
      </div>
    );
  }
  return (
    <div className="relative flex flex-col">
      <main className="relative flex">
        <aside>
          <LeftSideBar />
        </aside>
        <section className="flex min-h-screen flex-1 flex-col px-4 sm:px-14 overflow-x-hidden">
          <div className="mx-auto w-full max-w-5xl flex flex-col max-sm:px-4">
            <div className="md:hidden h-16 flex items-center justify-between">
              <Link to={"/"}>
                <img src="/icons/logo.svg" alt="Logo" width={30} height={30} />
              </Link>
              <MobileNav />
            </div>
            <div className="flex flex-col md:pb-14">
              <Toaster />
              {children ? children : <Outlet />}
            </div>
          </div>
        </section>
        <aside>
          <RightSideBar />
        </aside>
      </main>
      <PodcastPlayer />
    </div>
  );
}

export default AppLayout;
