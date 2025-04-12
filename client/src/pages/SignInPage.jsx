import GoogleAuth from "@/components/GoogleAuth.jsx";
import GithubAuth from "@/components/GithubAuth.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {useRef, useState} from "react";
import {Eye, EyeOff, Loader} from 'lucide-react';
import {Button} from "@/components/ui/button.jsx";
import {Link,useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext.jsx";
import {useToast} from "@/hooks/use-toast.js";


function SignInPage() {
    const { toast } = useToast();
    const [isPasswordVisible, setIsPasswordVisible] = useState(true);
    const navigate = useNavigate();
    const { loading , setLoading , setUser } = useAuth();
    const formRef = useRef({
        email : "",
        password: "",
    })

    function handleInputChange(field , value){
        formRef.current[field] = value;
    }


    async function handleSignIn(e){
        e.preventDefault();
        try{
            setLoading(true);
            const { email , password } = formRef.current;
            const res = await fetch(`/api/login`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({email: email, password: password})
            });
            const data = await res.json();
            console.log(data);
            if(data?.success){
                setUser(data?.userData);
                localStorage.setItem("user", JSON.stringify(data?.userData));
                setLoading(false);
                toast({
                    title : data?.message,
                })
                navigate("/");
            }else{
                toast({
                    title : data.message,
                    variant : "destructive",
                });
                setLoading(false);

            }
        }catch (e) {
            setLoading(false);
            toast({
                title : e.message
            });
        }
    }
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center w-full"
            // style={{
            //     backgroundImage:
            //         "url('/images/bg-img.jpg')",
            // }}
        >
            <div className="bg-[#15171c] shadow-lg rounded-2xl p-8 max-w-[400px] w-full flex flex-col items-center justify-center">
                <div className="flex flex-col">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-center gap-3">
                            <img src="/icons/logo.svg" alt="Logo"/>
                            <h2 className="text-20 font-bold text-white-1">Podcast Wale</h2>
                        </div>
                        <div>
                            <h3 className="text-15 font-extrabold text-white-1 text-center">
                                Sign in to podcast wale
                            </h3>
                            <span className="text-xs text-gray-400 font-bold">
                                Welcome Back! Please Sign in to continue.
                            </span>
                        </div>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-2">
                        <GoogleAuth/>
                        <GithubAuth/>
                    </div>
                    <p className="text-center text-gray-400 font-medium my-6">
                        OR
                    </p>
                </div>
                <form className="w-full flex flex-col" onSubmit={handleSignIn}>
                    <div className='flex flex-col gap-2.5 mb-3 w-full'>
                        <Label className="text-white-1 font-bold text-[13px]">
                            Email
                        </Label>
                        <Input
                            type="email"
                            name="email"
                            className="bg-[#1b1f29] focus:outline-none border-none text-gray-1  font-medium focus:ring-1 focus:ring-orange-1"
                            autoComplete="off"
                            onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col gap-2.5 w-full mb-3 relative'>
                        <Label className="text-white-1 font-bold text-[13px]">
                            Password
                        </Label>
                        <Input
                            type={isPasswordVisible ? "text" : "password"}
                            name="password"
                            className="bg-[#1b1f29] focus:outline-none border-none text-gray-1 font-medium focus:ring-1 focus:ring-orange-1"
                            placeholder=""
                            autoComplete="off"
                            onChange={(e) => handleInputChange("password", e.target.value)}
                        />
                        <div className="absolute right-2 top-[38px]"
                             onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                            {isPasswordVisible ? (
                                <Eye size={'18'} color={"gray"}/>
                            ) : (
                                <EyeOff size={'18'} color={"gray"}/>
                            )}
                        </div>

                    </div>
                    <span className="underline text-gray-300 text-right text-sm font-medium">
                    <Link to="/forgot-password" className="hover:underline hover:text-orange-1 duration-300 transition-all" >
                        Forgot Password
                    </Link>
                    </span>

                    <div className="w-full my-5">
                        <Button type="submit"
                                className="w-full bg-orange-1 text-white-1 font-bold text-[13px] flex items-center gap-2">
                            {loading ? (
                                <>
                                    <Loader className="animate-spin"/> Logging in...
                                </>
                            ) : "Continue"}
                        </Button>
                    </div>
                </form>

                {/* Optional Footer Links */}
                <div className="text-center mt-4 text-xs text-white-4 font-bold">
                    Don&apos;t have an account?{" "}
                    <Link to="/sign-up" className="text-orange-1 hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SignInPage;