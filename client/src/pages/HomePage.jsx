import PodCastCard from "@/components/PodCastCard.jsx";
import { useEffect, useState } from "react";
import HorizontalPodcastLoader from "@/Loader/HorizontalPodcastLoader";
import LatestPodcast from "@/components/LatestPodcast";
import { toast } from "@/hooks/use-toast";
import PopularPodcast from "@/components/PopularPodcast";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function HomePage() {
  const [allPodcast, setAllPodcast] = useState([]);
  const [isLoadingPodcast, setIsLoadingPodcast] = useState(true);
  const [latestPodcast, setLatestPodcast] = useState([]);
  const [popularPodcast, setPopularPodcast] = useState([]);

  async function handleAllPodcastData() {
    try {
      setIsLoadingPodcast(true);
      const res = await fetch("/api/get-all-podcast", {
        method: "GET",
      });
      const data = await res.json();
      if (data?.success) {
        setAllPodcast(data?.podcastData);
      } else {
        setIsLoadingPodcast(false);
        alert(data?.message);
      }
    } catch (e) {
      alert(e);
      setIsLoadingPodcast(false);
    } finally {
      setTimeout(() => setIsLoadingPodcast(false), 1000);
    }
  }

  async function handleLatestPodcast() {
    try {
      const res = await fetch("/api/get-latest-podcast");
      const data = await res.json();
      if (data?.success) {
        setLatestPodcast(data?.podcastData);
      } else {
        toast({
          title: data?.message,
          variant: "destructive",
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handlePopularPodcast() {
    try {
      const res = await fetch("/api/get-popular-podcast");
      const data = await res.json();
      if (data?.success) {
        setPopularPodcast(data?.podcastData);
      } else {
        toast({
          title: data?.message,
          variant: "destructive",
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    handleAllPodcastData();
    handleLatestPodcast();
    handlePopularPodcast();
  }, []);

  return (
    <div className="mt-9 flex flex-col gap-9 overflow-x-hidden">
      <section
        className="text-white py-8 lg:py-12 px-6 rounded-lg bg-[#00695C] shadow-xl"
        style={{
          background:
           'linear-gradient(to right, rgb(123,63,30), rgb(250,217,130))'
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-5 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-[27px] xl:text-4xl text-white-1 font-extrabold leading-tight mb-6">
              Discover Voices That Inspire.
              <br />
              Your Podcast Journey Starts Here.
            </h1>
            <p className="text-sm text-white-1 font-semibold mb-8 max-w-xl">
              Stream insightful conversations, stories, and interviews from your
              favorite creators. Anytime. Anywhere.
            </p>
            <div className="flex flex-col lg:flex-row gap-3 justify-center lg:justify-start">
              <Button className=" text-white-1  py-6 bg-orange-1 hover:bg-orange-600 rounded-full  font-bold transition">
                <Link to="/create-podcast" className="flex items-center gap-1">
                <img src="/icons/headphone.svg" className="w-5 h-5 lg:hidden xl:block"/> Create Podcast
                </Link>
              </Button>
              <Button className="px-6 text-white-1 py-6 border border-white hover:bg-white hover:text-black rounded-full font-bold transition">
                <Link to="/create-youtube-podcast">
                Explore Podcast
                </Link>
              </Button>
            </div>
          </div>

          {/* Image or Illustration */}
          <div className="flex-1">
            <img
              src="/images/mic.png"
              alt="Podcast Illustration"
              className="rounded-full w-full h-full hidden lg:block mx-auto bg-[rgb(250,217,130)]"
            />
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-3 px-2">
        <h1 className="text-20 font-bold text-white-1">Trending Podcast</h1>
        <div>
          {isLoadingPodcast ? (
            <div className="mt-5 flex gap-5 overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 px-2z-20">
              <HorizontalPodcastLoader cardLength={allPodcast?.length} />
            </div>
          ) : (
            <div className="mt-5 flex gap-5 overflow-x-auto max-w-full  px-2">
              {allPodcast?.map((podcast) => (
                <PodCastCard
                  key={podcast._id}
                  podcastId={podcast._id}
                  imgURL={podcast.imageUrl}
                  description={podcast.podcastDescription}
                  title={podcast.podcastTitle}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <LatestPodcast data={latestPodcast} />
      <PopularPodcast data={popularPodcast} />
    </div>
  );
}

export default HomePage;
