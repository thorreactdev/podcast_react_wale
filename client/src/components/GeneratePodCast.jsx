import {Label} from "@/components/ui/label.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useState , useEffect} from "react";
import {Loader, MessageCircleQuestion} from "lucide-react";
import {useAuth} from "@/context/AuthContext.jsx";
import {usePodcast} from "@/context/PodCastContext.jsx";
// import {toast} from "@/hooks/use-toast.js";
import {toast} from "sonner";


const MAX_CHAR_LIMIT = 1800;

// eslint-disable-next-line react/prop-types
function GeneratePodCast({voicePrompt, setVoicePrompt, voiceId, setAudioDuration, audioURL, setAudioURL, setAudioStorageID}) {
    const {user} = useAuth();
    const {isVoiceGenerating , setIsVoiceGenerating , setIsVoiceGenerated , isVoiceGenerated} = usePodcast();
    const [hoverQuestionMark, setHoverQuestionMark] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [isExceeded, setIsExceeded] = useState(false);
    const [extraChars, setExtraChars] = useState(0);

    useEffect(() => {
        if (voicePrompt) {
            // eslint-disable-next-line react/prop-types
            setCharCount(voicePrompt?.length);
            // eslint-disable-next-line react/prop-types
            setIsExceeded(voicePrompt.length > MAX_CHAR_LIMIT);
            // eslint-disable-next-line react/prop-types
            setExtraChars(voicePrompt.length > MAX_CHAR_LIMIT ? voicePrompt.length - MAX_CHAR_LIMIT : 0);
        }
    }, [voicePrompt]);

    const handleTextChange = (e) => {
        const text = e.target.value;
        setVoicePrompt(text);
        setCharCount(text.length);

        if (text.length > MAX_CHAR_LIMIT) {
            setIsExceeded(true);
            setExtraChars(text.length - MAX_CHAR_LIMIT);
        } else {
            setIsExceeded(false);
            setExtraChars(0);
        }
    };

    async function handleAudioGeneration(e) {
        e.preventDefault();
        try {
            setIsVoiceGenerating(true);
            const timeout = setTimeout(()=>{
                // toast({
                //     title : "This might take a minute please wait.."
                // })
                toast("This might take a minute please wait...");
            }, 20000);
            const res = await fetch("/api/generate-audio", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({voicePrompt: voicePrompt , voiceId : voiceId})
            });
            clearTimeout(timeout);
            const data = await res.json();
            if (data?.success) {
                setAudioURL(data?.audioFileData?.audioUrl);
                setAudioStorageID(data?.audioFileData?.audioStorageId);
                // toast({
                //     title : data?.message
                // })
                toast.success(data?.message);
               setIsVoiceGenerated(true);
            } else {
                setIsVoiceGenerating(false);
                //toast message
                // toast({
                //     title : data?.message,
                //     variant : "destructive"
                // });
                toast.error(data?.message);
            }
        } catch (e) {
            console.log(e);
            //toast message error
            setIsVoiceGenerating(false);
        } finally {
            setIsVoiceGenerating(false);
        }
    }

    return (
        <div>
            <div className="flex flex-col gap-2.5 mt-10">
                <div className="relative">
                    <div className="flex justify-between flex-col gap-2 md:flex-row">
                        <div className="flex items-center gap-4 justify-between">
                            <Label className="text-[15px] font-bold text-white-1">
                                AI Prompt To Generate Podcast
                            </Label>
                            <MessageCircleQuestion size={20} className="text-gray-500 hover:text-white-1"
                                                   onMouseEnter={() => setHoverQuestionMark(true)}
                                                   onMouseLeave={() => setHoverQuestionMark(false)}/>
                        </div>
                        <div className={`text-left md:text-right font-semibold text-[13px] ${isExceeded ? "text-red-400" : "text-gray-400"}`}>
                            {isExceeded
                                ? `⚠️ Max character limit exceeded by ${extraChars} characters`
                                : `characters remaining : ${MAX_CHAR_LIMIT - charCount} `}
                        </div>
                    </div>
                    {
                        hoverQuestionMark && location?.pathname?.startsWith("/edit") ? (
                            <div
                                className="absolute top-[25px] left-4 mt-2 bg-black-1 w-full max-w-[400px] text-justify border border-black-6 text-white-1 font-semibold text-[12px] p-4 rounded-xl z-20"
                            >Hi , {user?.username} , You cannot edit the voice prompt or generate a new one! You can edit all other part accept this</div>
                        ):
                            hoverQuestionMark && location?.pathname === "/create-podcast" &&(
                            <div
                                className="absolute top-[25px] md:top-full left-6 md:left-52 mt-2 bg-black-1 w-full max-w-[400px] text-justify border border-black-6 text-white-1 font-semibold text-[10px] md:text-[12px] p-4 rounded-xl z-20">
                                Hi, {user?.username}! Please enter your podcast text carefully, as once the audio is
                                generated,
                                you won’t be able to edit it. Your podcast should be between 500 to 1800 characters and
                                should start with an engaging introduction. Make sure your content is clear, structured, and
                                free of errors before generating the audio. Ready? Let’s bring your podcast to life! 🎙️✨
                            </div>
                        )
                    }
                </div>

                <Textarea
                    rows={8}
                    className="input-class resize-none focus-visible:ring-black-5 py-5 text-white-1"
                    placeholder="Provide text to Generate audio"
                    name="voicePrompt"
                    value={voicePrompt}
                    onChange={handleTextChange}
                    disabled={isVoiceGenerating || isVoiceGenerated || location?.pathname.startsWith("/edit-podcast-page")}
                />
            </div>
            <div className="w-full mt-5 max-w-[250px]">
                <Button
                    type="submit"
                    className="w-full bg-black-1 font-bold text-white-1 border border-black-5 hover:bg-black-4 transition-all duration-500 py-6"
                    onClick={handleAudioGeneration}
                    disabled={isVoiceGenerating || isVoiceGenerated || location?.pathname.startsWith("/edit-podcast-page")}
                >
                    {isVoiceGenerating ? <>
                        <Loader className="animate-spin"/> Generating...
                    </> : "Generate Podcast"}
                </Button>
            </div>
            {audioURL && (
                <audio
                    controls
                    src={audioURL}
                    className="mt-5"
                    onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
                />
            )}
        </div>
    )
}

export default GeneratePodCast;