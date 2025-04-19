import { useAuth } from "@/context/AuthContext";
// import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { toast } from "sonner";

// eslint-disable-next-line react/prop-types
const ProtectTokenBackend = ({ children }) => {
  const { logoutUser } = useAuth();

  async function handleTokenChecking() {
    try {
      const res = await fetch("/api/protected", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: document.cookie,
        },
      });
      const data = await res.json();
      if (!data?.success) {
        toast.error(data?.message || "Session expired, please login again.");
        logoutUser();
      }
    } catch (err) {
      console.log("something went wrong", err);
    }
  }

  useEffect(() => {
      handleTokenChecking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children ? children : null;
};

export default ProtectTokenBackend;
