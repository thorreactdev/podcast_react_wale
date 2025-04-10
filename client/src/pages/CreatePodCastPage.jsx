import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import GeneratePodCast from "@/components/GeneratePodCast.jsx";
import GenerateThumbNail from "@/components/GenerateThumbNail.jsx";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { usePodcast } from "@/context/PodCastContext.jsx";
import { toast } from "@/hooks/use-toast.js";
import { useNavigate, useParams } from "react-router-dom";
import { createPodcastInitialFormData } from "@/utils/initialFormData.js";
import { useEffect, useState } from "react";
import voicesData from "@/constants/voices.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

function CreatePodCastPage() {
  const { user, setUser } = useAuth();
  const { podcastId } = useParams();
  const navigate = useNavigate();
  const [voiceName, setVoiceName] = useState("");

  const {
    podcastData,
    setPodcastData,
    isSubmitting,
    setIsSubmitting,
    isImageGenerated,
    isVoiceGenerated,
    isAIThumbnail,
    setIsAIThumbnail,
    setIsVoiceGenerated,
    setIsImageGenerated,
  } = usePodcast();

  function resetTrackingState() {
    setIsSubmitting(false);
    setIsAIThumbnail(false);
    setIsVoiceGenerated(false);
    setIsImageGenerated(false);
  }

  function handlePodcastFormData(e) {
    setPodcastData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }

  async function handlePodcastSubmission(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const podcastFinalFormData = {
        userId: user && user._id,
        podcastCreator: user && user?.username,
        creatorEmail: user && user?.email,
        creatorImageUrl: user && user?.userAvatar,
        ...podcastData,
      };

      if (podcastId) {
        const response = await fetch(
          `/api/edit-podcast/${podcastId}/${user?._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(podcastFinalFormData),
          }
        );
        const data = await response.json();
        if (data?.success) {
          toast({
            title: data?.message,
          });
          setPodcastData(createPodcastInitialFormData);
        } else {
          toast({
            title: data?.message,
            variant: "destructive",
          });
          navigate("/");
        }
      } else {
        const res = await fetch("/api/create-podcast", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Cookie: document.cookie,
          },
          body: JSON.stringify(podcastFinalFormData),
        });
        const data = await res.json();

        if (data?.success) {
          setUser(data?.userData);
          localStorage.setItem("user", JSON.stringify(data?.userData));
          toast({
            title: data?.message,
          });
          setPodcastData(createPodcastInitialFormData);
          navigate("/");
        } else {
          setIsSubmitting(false);
          toast({
            title: data?.message,
            variant: "destructive",
          });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEditPodcastData() {
    try {
      const res = await fetch(`/api/get-single-podcast/${podcastId}`);
      const data = await res.json();
      if (data?.success) {
        const setValuesInFormData = Object.keys(
          createPodcastInitialFormData
        ).reduce((acc, key) => {
          acc[key] = data?.podcastData[key];
          return acc;
        }, {});
        setPodcastData(setValuesInFormData);
      } else {
        toast({
          title: data?.message || "something went wrong",
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (podcastId) {
      handleEditPodcastData();
    } else {
      setPodcastData(createPodcastInitialFormData);
      resetTrackingState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podcastId]);

  return (
    <div className="mt-10 flex flex-col py-5 md:py-0">
      <h1 className="text-24 font-extrabold text-white-1">
        {podcastId ? "Update Podcast" : "Create Podcast"}
      </h1>
      <form
        onSubmit={handlePodcastSubmission}
        className="mt-12 w-full flex flex-col gap-5"
      >
        <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
          {/*podcast title div*/}
          <div className="flex flex-col gap-2.5">
            <Label className="text-[15px] font-bold text-white-1">
              Podcast Title
            </Label>
            <Input
              type="text"
              placeholder="Enter Podcast Title"
              name="podcastTitle"
              autoComplete="off"
              className="input-class resize-none focus-visible:ring-black-5 py-5 text-white-1"
              value={podcastData?.podcastTitle}
              onChange={handlePodcastFormData}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <Label className="text-[15px] font-bold text-white-1">
              Select Voice
            </Label>
            <Select
              onValueChange={(value) => {
                const selectedVoice = voicesData?.voices?.find(
                  (v) => v.id === value
                );
                if (selectedVoice) {
                  setPodcastData((prevData) => ({
                    ...prevData,
                    voiceId: selectedVoice?.id,
                    voiceName: selectedVoice?.name,
                    category: selectedVoice?.category,
                  }));
                  setVoiceName(selectedVoice?.name);
                }
              }}
            >
              <SelectTrigger
                className={cn(
                  "text-[15px]  capitalize w-full font-semibold border-none outline-none bg-black-1 text-gray-1 focus-visible:ring-black-5"
                )}
              >
                <SelectValue
                  placeholder="Select Your AI Voice"
                  className="font-semibold"
                />
              </SelectTrigger>
              <SelectContent className="bg-black-1 text-[15px] border-none font-semibold  text-white-1 py-4">
                {voicesData.voices.map((voice) => (
                  <SelectItem
                    key={voice.id}
                    value={voice.id}
                    className="focus:bg-black-4 cursor-pointer capitalize text-white-1"
                  >
                    {voice.name} ({voice.gender})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {voiceName && (
            <audio src={`/${voiceName}.mp3`} className="hidden" autoPlay />
          )}

          {/*podcast description*/}
          <div className="flex flex-col gap-2.5">
            <Label className="text-[15px] font-bold text-white-1">
              Podcast Description
            </Label>
            <Textarea
              rows={6}
              className="input-class resize-none focus-visible:ring-black-5 py-5 text-white-1"
              placeholder="Enter Podcast Description"
              name="podcastDescription"
              value={podcastData?.podcastDescription}
              onChange={handlePodcastFormData}
            />
          </div>
        </div>

        <div className="border-b border-black-5 pb-10">
          <GeneratePodCast
            voicePrompt={podcastData?.voicePrompt}
            setVoicePrompt={(value) =>
              setPodcastData((prev) => ({ ...prev, voicePrompt: value }))
            }
            audioURL={podcastData?.audioUrl}
            setAudioURL={(value) =>
              setPodcastData((prev) => ({ ...prev, audioUrl: value }))
            }
            setAudioStorageID={(value) =>
              setPodcastData((prev) => ({ ...prev, audioStorageId: value }))
            }
            setAudioDuration={(value) =>
              setPodcastData((prev) => ({ ...prev, audioDuration: value }))
            }
            voiceId={podcastData?.voiceId}
          />
        </div>
        <div>
          <GenerateThumbNail
            imagePrompt={podcastData?.imagePrompt}
            setImagePrompt={(value) =>
              setPodcastData((prev) => ({ ...prev, imagePrompt: value }))
            }
            imageURL={podcastData?.imageUrl}
            setImageURL={(value) =>
              setPodcastData((prev) => ({ ...prev, imageUrl: value }))
            }
            setImageStorageID={(value) =>
              setPodcastData((prev) => ({ ...prev, imageStorageId: value }))
            }
          />
        </div>
        <div className="mt-10">
          <Button
            type="submit"
            disabled={
              podcastId
                ? isSubmitting
                : isSubmitting ||
                  (isAIThumbnail ? !isImageGenerated : "") ||
                  !isVoiceGenerated
            }
            className="w-full bg-orange-1 text-white-1 font-bold py-5 hover:bg-black-1 hover:border hover:border-black-5 transition-all duration-500"
          >
            {isSubmitting ? (
              <>
                <Loader size={20} className="animate-spin ml-2" />{" "}
                {podcastId ? "Updating Podcast" : "Submitting Podcast"}
              </>
            ) : (
              <>{podcastId ? "Update Podcast" : "Submit and publish Podcast"}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreatePodCastPage;
