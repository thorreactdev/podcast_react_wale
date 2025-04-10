import { useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast.js";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer.jsx";
// import PodCastCard from "@/components/PodCastCard.jsx";
import PodcastCardSkeleton from "@/Loader/PodcastCardSkeleton.jsx";
import EmptyState from "@/components/EmptyState.jsx";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import MobilePodcastCard from "@/components/MobilePodcastCard";


function PodcastDetailPage() {
  const { podcastId } = useParams();
  
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 4;
  const [singlePodcastData, setSinglePodcastData] = useState({});
  const [isLoadingPodcast, setIsLoadingPodcast] = useState(false);
  const [isSimilarPodcastLoading, setIsSimilarPodcastLoading] = useState(true);
  const [similarPodcastData, setSimilarPodcastData] = useState([]);
  const isOwner = user?._id === singlePodcastData?.userId;

  console.log(singlePodcastData);

  async function fetchSinglePodcast() {
    try {
      setIsLoadingPodcast(true);
      const res = await fetch(`/api/get-single-podcast/${podcastId}`);
      const data = await res.json();
      if (data?.success) {
        setSinglePodcastData(data?.podcastData);
      } else {
        toast({
          title: data?.message,
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: e.message,
      });
    } finally {
      setIsLoadingPodcast(false);
    }
  }

  async function fetchSimilarPodcast() {
    try {
      setIsSimilarPodcastLoading(true);
      const res = await fetch(
        `/api/get-similar-podcast/${podcastId}?page=${page}&limit=${limit}`
      );
      const data = await res.json();
      if (data?.success) {
        const filterData = data?.podcastData?.filter(
          (podcast) => podcast?._id !== podcastId
        );
        setSimilarPodcastData(filterData);
      } else {
        setSimilarPodcastData([]);
        setIsSimilarPodcastLoading(false);
      }
    } catch (e) {
      setIsSimilarPodcastLoading(false);
      toast({
        title: e.message,
      });
    } finally {
      setIsSimilarPodcastLoading(false);
    }
  }

  

  useEffect(() => {
    if (podcastId) {
      fetchSinglePodcast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podcastId]);

  useEffect(() => {
    if (podcastId) {
      fetchSimilarPodcast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podcastId, page]);

  return (
    <>
      {isLoadingPodcast ? (
        <div className="flex-center gap-2 text-white-1 h-screen">
          <Loader className="animate-spin text-orange-1" />
        </div>
      ) : (
        <section className="flex w-full flex-col">
          <header className="mt-9 flex items-center justify-between">
            <h1 className="text-white-1 text-20 font-bold ">
              Currently Playing Podcast
            </h1>
            <figure className="flex gap-3">
              <img src="/icons/headphone.svg" width={20} alt="headphone" />
              <h2 className="text-white-1 font-semibold text-sm">
                {singlePodcastData?.views && singlePodcastData?.views}
              </h2>
            </figure>
          </header>
          <PodcastDetailPlayer
            isOwner={isOwner}
            podcastId={podcastId}
            {...singlePodcastData}
          />
          <p className="text-white-2 text-sm md:text-16 font-medium pt-[45px] pb-8">
            {singlePodcastData?.podcastDescription}
          </p>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-white-1 font-bold text-18">Transcription</h1>
              <p className="text-white-2 text-sm md:text-16 font-medium">
                {singlePodcastData?.voicePrompt}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-white-1 font-bold text-18">
                Thumbnail Prompt
              </h1>
              <p className="text-white-2 text-16 font-medium">
                {singlePodcastData?.imagePrompt
                  ? singlePodcastData?.imagePrompt
                  : "Creator has uploaded the custom image"}
              </p>
            </div>
          </div>
          <section className="mt-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
            <Button className="bg-black-1 hover:bg-black-4"   onClick={() => page > 1 && setPage(page - 1)}>
              <ChevronLeft
                className={`text-white-1 cursor-pointer ${
                  page === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                size={24}
              />
            </Button>    
             <Button disabled={similarPodcastData?.length === 0} className="bg-black-1 hover:bg-black-4" onClick={() => setPage(page + 1)}>
              <ChevronRight
                className={`text-white-1 cursor-pointer`}
                size={24}
              />
             </Button>
            </div>
            <div>
              <h1 className="text-20 font-bold text-white-1">
                Similar Podcast
              </h1>

              {similarPodcastData?.length > 0 && (
                <span className="text-white-2 text-[14px] font-semibold">
                  The below podcast list are shown based on the current voice of{" "}
                  {singlePodcastData?.voiceName} the podcast you are listening
                  to..
                </span>
              )}
            </div>
            {isSimilarPodcastLoading ? (
              <div className="podcast_grid">
                <PodcastCardSkeleton cardLength={4} />
              </div>
            ) : similarPodcastData && similarPodcastData.length > 0 ? (
              <div className="podcast_grid">
                {similarPodcastData?.map((podcast) => (
                  <MobilePodcastCard
                    key={podcast?._id}
                    podcastId={podcast?._id}
                    imgURL={podcast.imageUrl}
                    description={podcast.podcastDescription}
                    title={podcast?.podcastTitle}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Similar Podcast Found"
                buttonText="Discover more podcast"
                buttonLink="/discover"
              />
            )}
          </section>
        </section>
      )}
    </>
  );
}

export default PodcastDetailPage;
