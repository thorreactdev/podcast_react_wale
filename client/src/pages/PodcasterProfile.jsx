import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext.jsx";
import { toast } from "@/hooks/use-toast.js";
// import { Loader } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import MobilePodcastCard from "@/components/MobilePodcastCard";
import EmptyState from "@/components/EmptyState";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const PodcasterProfile = () => {
    const { userId } = useParams();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [podcasts, setPodcasts] = useState([]);
  
    async function fetchPodcasts() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/get-user-podcast/${userId}`);
        const data = await res.json();
        if (data?.success) {
          setPodcasts(data?.podcastData);
        } else {
          setIsLoading(false);
          toast({
            title: data?.message,
            variant: "destructive",
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
  
    useEffect(() => {
      fetchPodcasts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  return (
    <div className="mt-9">
    <h1 className="text-white-1 font-semibold  text-20">Podcaster Profile</h1>
    {isLoading ? (
      <div className="flex-center">
        {/* <Loader className="animate-spin text-orange-1" /> */}
      </div>
    ) : (
      <section className="flex flex-col">
        <ProfileCard
          imageUrl={podcasts[0]?.creatorImageUrl}
          userName={podcasts[0]?.podcastCreator}
          podcast={podcasts}
          email={podcasts[0]?.creatorEmail}
          credits={userId === user?._id ? user?.credits : null}
        />

          <h2 className="text-white-1 text-20 font-semibold mt-14">
            All Podcast
          </h2>
          <div className="podcast_grid py-5">
            {podcasts?.length > 0 ? (
              podcasts?.map((podcast) => (
                <MobilePodcastCard
                  key={podcast?._id}
                  podcastId={podcast?._id}
                  imgURL={podcast.imageUrl}
                  description={podcast.podcastDescription}
                  title={podcast?.podcastTitle}
                />
              ))
            ) : (
              <EmptyState title="No Podcast Uploaded" buttonLink={"/"} buttonText={"Go Home"}/>
            )}
          </div>
      </section>
    )}
  </div>
  )
}

export default PodcasterProfile