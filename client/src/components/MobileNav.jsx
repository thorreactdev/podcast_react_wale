import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { sidebarLinks } from "@/constants/index.js";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

function MobileNav() {
  const { user, logoutUser } = useAuth();
  const { pathname } = useLocation();
  const dynamicSideBarLinks =
    user && user?.isVerified
      ? [
          ...sidebarLinks,
          {
            route: "/my-profile",
            imgURL: "/icons/profile.svg",
            label: "My Profile",
          },
        ]
      : sidebarLinks;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <img
          src="/icons/hamburger.svg"
          alt="side_menu"
          className="w-8 h-8 cursor-pointer"
        />
      </SheetTrigger>
      <SheetContent side="left" className="border-none bg-black-1">
        <Link
          to={"/"}
          className="flex items-center gap-3 cursor-pointer pb-10 pl-4"
        >
          <img src="/icons/logo.svg" alt="logo" width={23} height={27} />
          <h1 className="text-24 font-extrabold text-white-1">Podcast React</h1>
        </Link>
        <div className="flex flex-col h-[90vh] justify-between">
          <div className="flex flex-col justify-between h-[calc(100vh - 72px) overflow-y-auto]">
            {/* <SheetClose> */}
            <nav className="flex flex-col h-full text-white-1 gap-6">
              {dynamicSideBarLinks?.map(({ route, imgURL, label }) => {
                const isActive =
                  pathname === route || pathname.startsWith(`${route}/`);
                return (
                  <SheetClose asChild key={route}>
                    <Link
                      key={route}
                      to={route}
                      className={cn(
                        "flex gap-3 font-semibold items-center py-4 px-4 justify-start",
                        {
                          "bg-nav-focus border-r-4 border-orange-1": isActive,
                        }
                      )}
                    >
                      <img src={imgURL} alt={label} width={24} height={24} />
                      {label}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
            {/* </SheetClose> */}
          </div>

          <div className="flex-center w-full pb-20 max-lg:px-4 lg:pr-5">
            {user && user?.isVerified ? (
              <SheetClose asChild>
                <Button
                  onClick={() => logoutUser()}
                  className="bg-black-1 text-white-1 border border-black-5 hover:bg-black-4 font-semibold w-full py-6 text-[14px]"
                >
                  Logout
                </Button>
              </SheetClose>
            ) : (
              <Link to="/sign-in" className="w-full">
                <SheetClose asChild>
                  <Button className="w-full py-6 text-[14px] text-white-1 bg-black-1 border border-black-5 hover:bg-black-4 font-semibold">
                    Sign in
                  </Button>
                </SheetClose>
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
