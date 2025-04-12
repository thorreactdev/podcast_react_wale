import {useState} from "react";

import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Link} from "react-router-dom";
import {Loader, MailIcon} from "lucide-react";
import {useAuth} from "@/context/AuthContext.jsx";
import { toast } from "@/hooks/use-toast";

function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState("");
    const { loading , setLoading } = useAuth();

    async function handlePasswordReset(e){
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch("/api/forgot-password",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({email :  email })
            });
            const data = await res.json();
            if(data?.success){
                setIsSubmitted(true);
                toast({
                    title : data?.message,
                })
            }else {
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


    return (
        <div className="p-4">
             <div className="max-w-md w-full bg-black-1 rounded-2xl shadow-xl">
            <div className="p-8">
                <h2 className="text-white-1 font-semibold text-xl text-center">
                    Forgot Password
                </h2>
                {
                    !isSubmitted ? (
                        <form onSubmit={handlePasswordReset}>
                            <p className="text-center text-white-1 font-normal text-sm my-6">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                            <div>
                                <Input
                                    type="email"
                                    value={email}
                                    name="email"
                                    className="bg-[#1b1f29] focus:outline-none border-none text-gray-1 font-medium focus:ring-1 focus:ring-orange-1 my-3"
                                    placeholder="Email Address"
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                            </div>
                            <Button disabled={loading} type="submit" className="w-full bg-orange-1 text-white-1 my-4 font-semibold">
                                { loading ? <>
                                    <Loader className="animate-spin"/> Sending Link..
                                </> : "Send Reset Link"}
                            </Button>
                        </form>
                    ) : (
                        <div>
                            <div className="w-16 h-16 bg-orange-1 rounded-full flex items-center justify-center mx-auto my-4">
                              <MailIcon className="text-white-1"/>
                            </div>
                                <p className='text-gray-300 mb-6 text-center text-sm'>
                                    If an account exists for {email}, you will receive a password reset link shortly.
                                </p>
                        </div>
                    )
                }
            </div>
            <div className="flex justify-center bg-opacity-55 bg-black-4 py-4 rounded-bl-2xl rounded-br-2xl  px-8">
                <Link to={"/sign-in"} className="text-white-1 text-sm font-medium flex items-center hover:underline hover:text-orange-1">
                    Back To Login
                </Link>
            </div>

        </div>

        </div>
       
)
}

export default ForgotPasswordPage;