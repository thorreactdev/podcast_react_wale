import {Button} from "@/components/ui/button.jsx";
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth';
import {app} from "@/config/fireBaseConfig.js";
import {useAuth} from "@/context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useState } from "react";

function GoogleAuth() {
    const [loading , setLoading] = useState(false);
    const auth = getAuth(app);
    const { setUser } = useAuth();
    const navigate = useNavigate();

    async function handleGoogleLogin(){
        try{
            setLoading(true);
            const googleProvider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, googleProvider);
            const res = await fetch("/api/google-auth",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    email : result?.user?.email,
                    username : result?.user?.displayName,
                    userAvatar : result?.user?.photoURL
                })
            });
            const data = await res.json();
            if(data?.success){
                setUser(data?.userData);
                localStorage.setItem("user", JSON.stringify(data?.userData));
                toast({
                    title : data?.message
                })// toast message;
                navigate("/");

            }else {
                setLoading(false);
                toast({
                    title : data?.message,
                    variant : "destructive"
                });
            }
        }catch (e){
            setLoading(false);
            console.log(e);
        }finally{
            setLoading(false);
        }
    }


    return(
        <div>
            <Button className="w-full text-white-1 bg-black-1" title={"google"} disabled={loading} onClick={handleGoogleLogin}>
            { loading ? (
                    <Loader className="animate-spin"/>
                ): (
                    <img src="/icons/google.svg" alt="google_logo" className="w-5 h-5"/>
                )}
               
            </Button>
        </div>
    )
}
export default GoogleAuth;