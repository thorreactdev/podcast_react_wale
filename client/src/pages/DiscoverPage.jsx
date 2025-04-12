import EmptyState from "@/components/EmptyState";
import MobilePodcastCard from "@/components/MobilePodcastCard";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const LIMIT = 8;

function DiscoverPage() {
  const [podcasts, setPodcasts] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [totalPodcasts, setTotalPodcast] = useState(0);
  const [totalPage , setTotalPage] = useState(0);


  //debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  //actual api call logic
  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/get-discover-podcast?searchTerm=${debouncedSearchTerm}&page=${page}&limit=${LIMIT}`
        );
        const data = await res.json();
        if (data?.success) {
          setPodcasts((prev) =>
            page === 1 ? data?.podcastData : [...prev, ...data.podcastData]
          );
          setHasMore(page < data?.totalPages);
          setTotalPodcast(data?.totalPodcasts);
          setTotalPage(data?.totalPages);
        } else {
          toast({
            title: data?.message,
            variant: "destructive",
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPodcast();
  }, [page, debouncedSearchTerm]);

  //infinite scroll

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  return (
    <div className="flex flex-col gap-9">
      <div className="relative mt-8 block">
      <Input
        className="input-class py-6 pl-12 focus-visible:ring-black-5"
        placeholder='Search for podcasts'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onLoad={() => setSearchTerm('')}
      />
      <img
        src="/icons/search.svg"
        alt="search"
        height={20}
        width={20}
        className="absolute left-4 top-3.5"
      />
    </div>
      <div className="flex flex-col gap-9">
        <div className="flex flex-col">
          <h1 className="text-20 font-bold text-white-1 leading-tight">
            {!searchTerm ? "Discover Trending Podcast " : "Search Result For : "}
            {searchTerm && <span className="text-white-2">{searchTerm}</span>}
          </h1>
          <div className="flex flex-col md:justify-between md:flex-row">
            <span className="text-sm text-gray-1 font-semibold">
              Total Available Podcast : {totalPodcasts}
            </span>
            <span className="text-sm text-gray-1 font-semibold">
                Currently on Page : {totalPage}
            </span>
            <span className="text-sm text-gray-1 font-semibold">
              Currently Showing : {podcasts?.length}
            </span>

          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex-center h-[70vh]">
          <Loader className="animate-spin text-orange-1" />
        </div>
      ) : (
        <>
          {podcasts && podcasts?.length > 0 ? (
            <div className="podcast_grid pb-10 md:pb-5">
              {podcasts?.map((podcast) => (
                <MobilePodcastCard
                  key={podcast?._id}
                  podcastId={podcast._id}
                  imgURL={podcast.imageUrl}
                  description={podcast.podcastDescription}
                  title={podcast.podcastTitle}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No Result Found. Refine Your Search.." />
          )}
        </>
      )}
    </div>
  );
}

export default DiscoverPage;
