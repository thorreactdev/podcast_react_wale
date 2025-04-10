import {createContext, useContext, useState} from "react";
import {useToast} from "@/hooks/use-toast.js";

const AuthContext = createContext(null);
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const { toast } = useToast();
    const [loading , setLoading] = useState(false);
    const [user , setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    async function handleSignUpLogic(formData){
        console.log(formData);
        setLoading(true);
        try{
            const res = await fetch("/api/signup", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify(formData)
            });
            const data = await res.json();
            if(data?.success){
                return data;
            }else{
                return data;
            }
        }catch (e){
            setLoading(false);
            console.log(e);
        }finally {
            setLoading(false);
        }
    }

    async function handleVerifyEmail(code){
        try{
            setLoading(true);
            const res = await fetch("/api/verify-email",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({code})
            })
            const data = await res.json();
            return data;
        }catch (e) {
            console.log(e);
        }finally {
            setLoading(false);
        }

    }

    async function logoutUser() {
        try {
            const res = await fetch("/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            const data = await res.json();
            if (data?.success) {
                setUser(null);
                localStorage.removeItem("user");
                // toast({
                //     title : data?.message
                // })
            } else {
                toast({
                    title : data?.message
                })
            }
        } catch (e) {
            console.log(e);
            toast({
                title : e?.message
            })
        }
    }

    return (
        <AuthContext.Provider value={{ handleSignUpLogic , loading , setLoading  , user , setUser ,logoutUser, handleVerifyEmail}}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);