import { Button } from "@/components/ui/button.jsx";
import {
  signInWithPopup,
  GithubAuthProvider,
  getAuth,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  linkWithCredential,
} from "firebase/auth";
import { app } from "@/config/fireBaseConfig.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useState } from "react";

function GithubAuth() {
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  async function handleGithubLogin() {
    try {
      setLoading(true);
      const githubProvider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, githubProvider);
      const res = await fetch("/api/github-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: result?.user?.email,
          username: result?.user?.displayName,
          userAvatar: result?.user?.photoURL,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setUser(data?.userData);
        localStorage.setItem("user", JSON.stringify(data?.userData));
        toast({
          title: data?.message,
        });
        setLoading(false);
        navigate("/");
      } else {
        setLoading(false);
        toast({
          title: data?.message,
          variant: "destructive",
        });
      }
    } catch (e) {
      if (e.code === "auth/account-exists-with-different-credential") {
        const email = e.customData.email;
        const pendingCredentials = GithubAuthProvider.credentialFromError(e);

        if (email && pendingCredentials) {
          try {
            const getSignInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (getSignInMethods.includes("google.com") || getSignInMethods?.length === 0) {
              toast({
                title:
                  "This email is linked with Google. Please sign in with Google first.",
              });
              const googleProvider = new GoogleAuthProvider();
              const googleResult = await signInWithPopup(auth, googleProvider);

              await linkWithCredential(googleResult?.user, pendingCredentials);
              toast({
                title: "GitHub account linked successfully! Login again with github",
              });
            }
          } catch (linkError) {
            console.error("Credential Linking Error:", linkError);
            toast.error(`Linking failed: ${linkError.message}`);
          }
        }
      } else {
        toast({
          title: "something went wrong",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <Button
        className="w-full text-white-1 bg-black-1"
        title={"github"}
        onClick={handleGithubLogin}
        disabled={loading}
      >
        {loading ? (
          <Loader className="animate-spin" />
        ) : (
          <img
            src="/icons/github.svg"
            alt="google_logo"
            className="w-5 h-5 bg-black-1 rounded-full"
          />
        )}
      </Button>
    </div>
  );
}
export default GithubAuth;
