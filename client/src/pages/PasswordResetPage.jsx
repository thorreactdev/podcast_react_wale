import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useState} from "react";
import {useAuth} from "@/context/AuthContext.jsx";
import {useParams} from "react-router-dom";
import {Loader} from "lucide-react";
import {useNavigate} from "react-router-dom";
import { toast } from "@/hooks/use-toast";

function PasswordResetPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { loading , setLoading } = useAuth();
    const { token } = useParams();
    const navigate = useNavigate();

    async function handlePasswordReset(e){
        e.preventDefault();
        try{

            if(!password || !confirmPassword){
                return alert("please provide the password");
            }
            if(password !== confirmPassword){
                return alert("password not match");
            }
            setLoading(true);
            const res = await fetch(`/api/reset-password/${token}`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({ password : password})
            });
            const data = await res.json();
            if(data?.success){
                toast({
                    title : data?.message,
                })
                navigate("/sign-in");
            }else{
                setLoading(false);
                toast({
                    title : data?.message,
                    variant : "destructive"
                })
            }
        }catch (e) {
            console.log(e);
        }finally {
            setLoading(false);
        }
    }
    return(
        <div className="bg-black-1 w-full max-w-md p-8 rounded-2xl shadow-xl">
          <form onSubmit={handlePasswordReset}>
            <h2 className="text-center text-white-1 font-semibold text-xl my-3">
                Reset Your Password
            </h2>
            <div className="flex flex-col gap-2">
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="bg-[#1b1f29] focus:outline-none border-none text-gray-1 font-medium focus:ring-1 focus:ring-orange-1 my-3"
                />
                <Input
                    type="password"
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    className="bg-[#1b1f29] focus:outline-none border-none text-gray-1 font-medium focus:ring-1 focus:ring-orange-1 my-3"
                />
            </div>
            <Button disabled={loading} type="submit" className="w-full bg-orange-1 text-white-1 font-semibold my-2">
                {loading ? <>
                    <Loader className="animate-spin"/> Changing Password...
                </> : "Reset Password"}
            </Button>
          </form>

        </div>
    )
}
export default PasswordResetPage;