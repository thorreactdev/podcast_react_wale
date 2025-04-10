import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const ProtectCheckCredit = ({ children }) => {
    const navigate = useNavigate();
    useEffect(()=>{
        async function checkUserCredit() {
          const res = await fetch("/api/check-credits",{
            method : "GET",
            credentials : "include",
          });
          const data = await res.json();
          if(!data?.success){
            toast({
              title : data?.message,
              variant : "destructive"
            });

            navigate("/subscribe" , { replace : true});
          }
        }
        checkUserCredit();
    
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[]);


  return children ? children : null
}

export default ProtectCheckCredit