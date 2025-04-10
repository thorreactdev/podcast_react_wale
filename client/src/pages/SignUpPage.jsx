import GoogleAuth from "@/components/GoogleAuth.jsx";
import GithubAuth from "@/components/GithubAuth.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {useRef, useState} from "react";
import {Eye, EyeOff, Loader} from 'lucide-react';
import {Button} from "@/components/ui/button.jsx";
import {Link , useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext.jsx";
import {toast} from "@/hooks/use-toast.js";



function SignUpPage() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(true);
    const { handleSignUpLogic , loading , setUser , setLoading, } = useAuth();
    const navigate = useNavigate();
    const formRef = useRef({
        username : "",
        email : "",
        password: "",
    })

    function handleInputChange(field , value){
        formRef.current[field] = value;
    }

    async function handleSignUp(e){
        e.preventDefault();
        const { username, email, password } = formRef.current;
        const getData = await handleSignUpLogic({ username: username, email: email , password: password});
        if(getData?.success){
            setUser(getData?.userData);
            localStorage.setItem("user", JSON.stringify(getData?.userData));
            toast({
                title : getData?.message
            })
            setTimeout(()=>{
                toast({
                    title : getData?.creditMessage
                })
            }, 2000);
            setLoading(false);
            navigate("/email-verify");
        }else{
            toast({
                title : getData?.message,
                variant : "destructive"
            })
            setLoading(false);
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center w-full"
            style={{
                backgroundImage:
                    "url('/images/bg-img.jpg')",
            }}
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
                                Create your account
                            </h3>
                            <span className="text-xs text-gray-400 font-bold">
                                Welcome! Please fill in the details to get started.
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
                <form className="w-full flex flex-col gap-4" onSubmit={handleSignUp}>
                    <div className='flex flex-col gap-2.5 w-full'>
                        <Label className="text-white-1 font-bold text-[13px]">
                            Username
                        </Label>
                        <Input
                            type="text"
                            name="username"
                            className="bg-[#1b1f29] focus:outline-none border-none text-gray-1 font-medium focus:ring-1 focus:ring-orange-1"
                            placeholder=""
                            autoComplete="off"
                            onChange={(e)=> handleInputChange("username", e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col gap-2.5 w-full'>
                        <Label className="text-white-1 font-bold text-[13px]">
                            Email
                        </Label>
                        <Input
                            type="email"
                            name="email"
                            className="bg-[#1b1f29] focus:outline-none border-none text-gray-1  font-medium focus:ring-1 focus:ring-orange-1"
                            autoComplete="off"
                            onChange={(e)=> handleInputChange("email", e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col gap-2.5 w-full relative'>
                        <Label className="text-white-1 font-bold text-[13px]">
                            Password
                        </Label>
                        <div className="">
                            <Input
                                type={isPasswordVisible ? "text" : "password"}
                                name="password"
                                className="bg-[#1b1f29] focus:outline-none border-none text-gray-1 font-medium focus:ring-1 focus:ring-orange-1"
                                placeholder=""
                                autoComplete="off"
                                onChange={(e)=> handleInputChange("password", e.target.value)}
                            />
                        </div>
                        <div className="absolute right-2 top-[38px]" onClick={()=> setIsPasswordVisible(!isPasswordVisible)}>
                            {isPasswordVisible ? (
                                <Eye size={'18'} color={"gray"}/>
                            ) : (
                                <EyeOff size={'18'} color={"gray"}/>
                            )}
                        </div>
                    </div>
                    <div className="w-full my-5">
                        <Button className="w-full bg-orange-1 text-white-1 font-bold text-[13px] flex items-center gap-2">
                            {loading ? (
                                <>
                                    <Loader className="animate-spin"/>  Creating account..
                                </>
                            ): "Continue"}
                        </Button>
                    </div>
                </form>

                {/* Optional Footer Links */}
                <div className="text-center mt-4 text-xs text-white-4 font-bold">
                    Already have an account?{" "}
                    <Link to="/sign-in" className="text-orange-1 hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage;