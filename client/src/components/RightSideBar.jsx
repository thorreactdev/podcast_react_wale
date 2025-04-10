import { useAuth } from "@/context/AuthContext.jsx";
import { Input } from "@/components/ui/input.jsx";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import Header from "./Header";
import EmblaCarousel from "./Carousel";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";

const OPTIONS = { loop: true }
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

function RightSideBar() {
  const { user, setUser } = useAuth();
  const imageRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const allowedType = ["image/png", "image/jpeg", "image/jpg"];
  const[top , setTop] = useState([]);
  const [loading , setLoading] = useState(true);

  async function handleUserImageUpload(e) {
    const imageFile = e.target.files[0];
    if (!allowedType.includes(imageFile?.type)) {
      return toast({
        title: "This only accept image files",
        variant: "destructive",
      });
    }
    if (imageFile?.size > 3 * 1024 * 1024) {
      return toast({
        title: "File size cannot be greater than 3MB",
        variant: "destructive",
      });
    }
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await fetch(
        `/api/update-profile-pic/${user?._id}/${user?.email}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data?.success) {
        setUser(data?.userData);
        localStorage.setItem("user", JSON.stringify(data?.userData));
        toast({
          title: data?.message,
        });
      } else {
        toast({ title: data?.message, variant: "destructive" });
        setIsUploading(false);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
      async function getTopPodcaster() {
        try{
          setLoading(true);
          const res = await fetch("/api/get-top-podcast");
          const data = await res.json();
          if (data?.success) {
            const flatData = data.topOne.reduce(
              (acc, curr) => acc.concat(curr),
              []
            );
            setTop(flatData);
          } else {
            toast({
              title: data?.message,
              variant: "destructive",
            });
          }
        }catch(e){
          console.log(e);
        }finally{
          setLoading(false);
        }
      }
      getTopPodcaster();
    }, []);

  return (
    <div className="right_sidebar min-h-screen text-white-1 relative">
      {user && user?.isVerified ? (
        <>
          <div className="flex items-center justify-between cursor-pointer pb-12">
            <div className="flex gap-2 items-center cursor-pointer">
              <Input
                type="file"
                accept="image/*"
                ref={imageRef}
                className="hidden"
                onChange={handleUserImageUpload}
              />
              {isUploading ? (
                <Skeleton className="h-10 w-10 rounded-full bg-black-5 mr-3" />
              ) : (
                <img
                  src={user?.userAvatar}
                  onClick={() => imageRef?.current?.click()}
                  alt="user_image"
                  className="w-9 h-9 rounded-full border-2 p-0.5 object-cover"
                />
              )}
             <Link to="/my-profile">
              <span className="text-white-1 font-semibold text-[15px]">
                {user?.username}
              </span>
             </Link>  
            </div>
            <div>
              <Link to="/my-profile">
              <img src="/icons/right-arrow.svg" width={20} height={20} />
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="hidden"></div>
      )}
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <Loader className="animate-spin text-orange-1"/>
        </div>
      ): (
        <>
        <Header headerTitle="Fans Like You"/>
        <EmblaCarousel  slides={SLIDES} options={OPTIONS} top={top}/>
        </>
      )}
    </div>
  );
}

export default RightSideBar;
