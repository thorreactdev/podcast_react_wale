import {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useAuth} from "@/context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {Loader} from "lucide-react";
import {toast} from "@/hooks/use-toast.js";

function EmailVerificationPage() {
    const [code , setCode] = useState(["", "", "" , "", "", ""]);
    const[emailLoading , setEmailLoading] = useState(false);
    const inputRef = useRef([]);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const { loading, handleVerifyEmail , user, setUser } = useAuth();
    const navigate = useNavigate();


    useEffect(()=>{
            navigate(user?.isVerified === false ? "/email-verify" : user?.isVerified === true ? "/" : "/sign-up");
    },[user , navigate]);

    useEffect(() => {
        window.history.pushState(null, "", window.location.href);
        window.history.pushState(null, "", window.location.href);

        window.onpopstate = () => {
            window.history.go(1);
        };
    }, []);





    function handleChange(index , value){
        if (!/^\d*$/.test(value)){
            return alert("Please Enter Numbers Only");
        }
        const newCode = [...code];
        if(value.length > 1){
            const pastedCode = value.slice(0,6).split("");
            for(let i=0 ; i < 6 ; i++){
                newCode[i] = pastedCode[i] || "";
            }
            setCode(newCode);
            const lastFilledIndex = newCode?.findLastIndex((digit)=> digit !== "");
            const focusedIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRef.current[focusedIndex].focus();
        }else{
        newCode[index] = value;
        setCode(newCode);
        if(value && index < 5){
            inputRef.current[index + 1].focus();
        }
        }
    }

    function handleKeyDown(index ,e){
        if(e.key === "Backspace" && !code[index] && index > 0){
            inputRef.current[index - 1].focus();
        }
    }

    async function handleSubmit(e){
        e.preventDefault();
        const verificationCode = code.join("");
        try{
            const getData = await handleVerifyEmail(verificationCode);
            if(getData?.success){
                setUser(getData?.userData);
                localStorage.setItem("user", JSON.stringify(getData?.userData));
                toast({
                    title : getData?.message
                })
                navigate("/" , { replace : true});
            }else{
                toast({
                    title : getData?.message,
                    variant : "destructive"
                })
                setCode(["", "", "" , "", "", ""]);
                inputRef.current[0].focus();
            }
        }catch (e) {
            console.log(e);
        }
    }

    async function handleResendCodeEmail(e){
        e.preventDefault();
        setEmailLoading(true);
        setTimer(30);
        setCanResend(false);
        try{
            const res = await fetch("/api/resend-code",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({ email : user?.email})
            })
            const data = await res.json();
            if(data?.success){
                toast({
                    title : data?.message
                })
            }else{
                setEmailLoading(false);
                toast({
                    title : data?.message,
                    variant : "destructive"
                })
            }
        }catch (e) {
            console.log(e);
            setEmailLoading(false);
        }finally {
            setEmailLoading(false);
        }
    }

    useEffect(()=>{
        //auto submit
        if(code.every((digit)=> digit !== "") && code.length === 6){
            handleSubmit(new Event("submit"));
        }
    },[code]);

    useEffect(()=>{
        if(timer > 0){
            const countDown = setTimeout(()=> setTimer(timer - 1), 1000);
            return () => clearTimeout(countDown);
        }else{
            setCanResend(true);
        }
    },[timer]);

    return(
        <div className='flex items-center justify-center h-screen w-full'>
            <div className="w-full bg-black-1 max-w-lg rounded-2xl shadow-xl overflow-hidden p-8 flex flex-col gap-2">
                <h2 className="text-center text-white-1 font-semibold text-xl mb-3">
                    Verify Email
                </h2>
                <p className="text-center text-white-1 font-normal text-white mb-3">
                    Enter the 6-digit code sent to your email address
                </p>
                <form onSubmit={handleSubmit} className="my-5">
                    <div className="flex justify-between">
                        {code?.map((digit, index) => (
                            <Input
                                key={index}
                                value={digit}
                                ref={(el) => {
                                    inputRef.current[index] = el;
                                }}
                                maxLength="6"
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className='w-14 h-14 text-center text-white-1 text-3xl font-bold  border-2 border-black-5 rounded-lg focus:border-orange-1 focus:outline-none'
                            />
                        ))}
                    </div>
                    <div className="text-center text-sm text-white-1 font-normal text-white mt-4 flex justify-end gap-1">
                        Didn’t receive the code?{" "}
                        <button
                            className={`font-semibold underline ${canResend ? "text-orange-1" : "text-gray-400 cursor-not-allowed"}`}
                            disabled={!canResend}
                            onClick={handleResendCodeEmail}
                        >
                            {" "}{canResend ? "Resend Code" : emailLoading ? <div className="flex items-center gap-1">
                            <Loader className="animate-spin"/>
                            wait sending code to email
                        </div>: `Resend in ${timer}s`}
                        </button>
                    </div>
                    <Button type="submit" className="w-full bg-orange-1 text-white-1 mt-10 rounded-lg font-semibold"
                            disabled={loading}
                    >
                        {loading ?
                            <>
                                <Loader className="animate-spin"/> Verifying..
                            </>
                            : "Verify Email"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default EmailVerificationPage;