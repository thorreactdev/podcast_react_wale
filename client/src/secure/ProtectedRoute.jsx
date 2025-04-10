import {useAuth} from "@/context/AuthContext.jsx";
import {Navigate} from "react-router-dom";

// eslint-disable-next-line react/prop-types
export function ProtectedRoute({ children }){
    const { user } = useAuth();
    if(!user){
        return <Navigate to="/sign-in" replace />
    }
    if(!user?.isVerified){
        return <Navigate to="/email-verify" replace/>
    }
    return children;
}

// eslint-disable-next-line react/prop-types
export function AuthRedirect({ children }){
    const { user } = useAuth();
    if(user && user?.isVerified){
        return <Navigate to="/" replace={true}/>
    }
    return children;
}



