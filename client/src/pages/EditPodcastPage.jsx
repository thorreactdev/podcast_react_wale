import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "@/context/AuthContext.jsx";
import {toast} from "@/hooks/use-toast.js";
import {Loader} from "lucide-react";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import GeneratePodCast from "@/components/GeneratePodCast.jsx";
import GenerateThumbNail from "@/components/GenerateThumbNail.jsx";
import {Button} from "@/components/ui/button.jsx";
import {usePodcast} from "@/context/PodCastContext.jsx";
import {useNavigate} from "react-router-dom";

function EditPodcastPage() {
    const { podcastId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const {  podcastTitle, setPodcastTile, podcastDescription, setPodcastDescription, imagePrompt,
        setImagePrompt,audioURL, setAudioURL ,audioDuration, setAudioDuration,audioStorageID,setAudioStorageID,imageURL,
        setImageURL,imageStorageID, setImageStorageID,voicePrompt, setVoicePrompt, isSubmitting,
        setIsSubmitting } = usePodcast();
    const [loading , setLoading] = useState(false);
    const [editPodcastDetails, setEditPodcastDetails] = useState({});





    async function handleEditPodcastData() {
        setLoading(true);
        const res = await fetch(`/api/get-edit-single-podcast/${podcastId}/${user?._id}`);
        const data = await res.json();
        console.log(data);
        if(data?.success){
            setEditPodcastDetails(data?.podcastData);
        }else{
            toast({
                title : data?.message,
            })
            setLoading(false);
        }
        setLoading(false);
    }

    async function handleUpdatingPodcastData(e){
        e.preventDefault();
        try{
            setIsSubmitting(true);
            const res = await fetch(`/api/edit-podcast/${podcastId}/${user?._id}`,{
                method: "PUT",
                headers : {
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    userId : user?._id,
                    podcastTitle : podcastTitle || editPodcastDetails?.podcastTitle,
                    podcastDescription : podcastDescription || editPodcastDetails?.podcastDescription,
                    voicePrompt : voicePrompt || editPodcastDetails?.voicePrompt,
                    audioStorageId : audioStorageID || editPodcastDetails?.audioStorageId,
                    audioUrl : audioURL || editPodcastDetails?.audioUrl,
                    audioDuration : audioDuration || editPodcastDetails?.audioDuration,
                    imagePrompt : imagePrompt || editPodcastDetails?.imagePrompt,
                    imageStorageId : imageStorageID || editPodcastDetails?.imageStorageId,
                    imageUrl : imageURL || editPodcastDetails?.imageUrl
                })
            })
            const data = await res.json();
            console.log(data);
            if(data?.success){
                toast({
                    title : data?.message
                })
                resetFormEditPage();
                navigate("/");
            }else{
                toast({
                    title : data?.message,
                    variant : "destructive"
                })
                setIsSubmitting(false);


            }
        }catch (e) {
            console.log(e);
            setIsSubmitting(false);
        }finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        handleEditPodcastData();
    }, []);

    return(
        <div>
            {
                loading ? (
                    <div>
                        <Loader className="animate-spin"/> Loading...
                    </div>
                ): (
                    <div className="mt-10 flex flex-col">
                        <h1 className="text-24 font-extrabold text-white-1">
                            Update PodCast
                        </h1>
                        <form onSubmit={handleUpdatingPodcastData} className="mt-12 w-full flex flex-col gap-5">
                            <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
                                {/*podcast title div*/}
                                <div className="flex flex-col gap-2.5">
                                    <Label className="text-[15px] font-bold text-white-1">
                                        Podcast Title
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter Podcast Title"
                                        className="input-class resize-none focus-visible:ring-black-5 py-5 text-white-1"
                                        value={ podcastTitle || editPodcastDetails?.podcastTitle}
                                        onChange={(e) => setPodcastTile(e.target.value)}
                                    />
                                </div>

                                {/*podcast description*/}
                                <div className="flex flex-col gap-2.5">
                                    <Label className="text-[15px] font-bold text-white-1">
                                        Podcast Description
                                    </Label>
                                    <Textarea
                                        rows={6}
                                        className="input-class resize-none focus-visible:ring-black-5 py-5 text-white-1"
                                        placeholder="Enter Podcast Description"
                                        value={podcastDescription || editPodcastDetails?.podcastDescription}
                                        onChange={(e) => setPodcastDescription(e.target.value)}
                                    />
                                </div>

                            </div>

                            <div className="border-b border-black-5 pb-10">
                                <GeneratePodCast
                                    voicePrompt={voicePrompt || editPodcastDetails?.voicePrompt}
                                    setVoicePrompt={setVoicePrompt}
                                    audioURL={audioURL || editPodcastDetails?.audioUrl}
                                    setAudioURL={setAudioURL}
                                    setAudioStorageID={setAudioStorageID}
                                    setAudioDuration={setAudioDuration}
                                />
                            </div>
                            <div>
                                <GenerateThumbNail
                                    imagePrompt={imagePrompt || editPodcastDetails?.imagePrompt}
                                    setImagePrompt={setImagePrompt}
                                    imageURL={imageURL || editPodcastDetails?.imageUrl}
                                    setImageURL={setImageURL}
                                    setImageStorageID={setImageStorageID}
                                />
                            </div>
                            <div className="mt-10">
                                <Button type="submit"
                                        className="w-full bg-orange-1 text-white-1 font-bold py-5 hover:bg-black-1 hover:border hover:border-black-5 transition-all duration-500">
                                    {isSubmitting ? (
                                        <>
                                            <Loader size={20} className="animate-spin ml-2"/> Updating Podcast
                                        </>
                                    ) : "Update Podcast"}
                                </Button>
                            </div>
                        </form>

                    </div>
                )
            }
        </div>
    )
}

export default EditPodcastPage;