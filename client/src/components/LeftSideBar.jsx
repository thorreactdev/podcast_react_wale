import {Link, useLocation} from "react-router-dom";
import {sidebarLinks} from "@/constants/index.js";
import {cn} from "@/lib/utils.js";
import {Button} from "@/components/ui/button.jsx";
import {useAuth} from "@/context/AuthContext.jsx";

function LeftSideBar(){
    const { pathname } = useLocation();
    const { user , logoutUser} = useAuth();
    const dynamicSideBarLinks = user && user?.isVerified ? [...sidebarLinks , { route : "/my-profile", imgURL : "/icons/profile.svg", label : "My Profile"}] : sidebarLinks;
    return(
        <div className="left_sidebar min-h-screen">
            <nav className="flex flex-col gap-6">
                <Link to={"/"} className="flex items-center gap-3 cursor-pointer pb-10 max-lg:justify-center">
                    <img src="/icons/logo.svg" alt="logo" width={23} height={27}/>
                    <h1 className="text-24 font-extrabold text-white max-lg:hidden">
                        Podcast React
                    </h1>
                </Link>
                {dynamicSideBarLinks?.map(({ route , imgURL , label})=>{
                    const isActive = pathname === route || pathname.startsWith(`${route}/`)
                    return (
                    <Link key={route} to={route} className={cn("flex gap-3 font-semibold items-center py-4 justify-center lg:justify-start max-lg:px-4", {
                        "bg-nav-focus border-r-4 border-orange-1" : isActive
                    })}>
                        <img src={imgURL} alt={label} width={24} height={24}/>
                        {label}
                    </Link>
                    )})}
            </nav>
            <div className="flex-center w-full pb-10 max-lg:px-4 lg:pr-5">
                { user && user?.isVerified ? (
                    <Button onClick={()=> logoutUser()}  className="bg-black-1 border border-black-5 hover:bg-black-4 font-semibold w-full py-6 text-[14px]">
                        Logout
                    </Button>
                ): (
                  <Link to="/sign-in" className="w-full">
                    <Button  className="w-full py-6 text-[14px] bg-black-1 border border-black-5 hover:bg-black-4 font-semibold">
                          Sign in
                    </Button>
                  </Link>
                )}
            </div>
        </div>
    )
}

export default LeftSideBar;