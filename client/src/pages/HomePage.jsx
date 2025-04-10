import PodCastCard from "@/components/PodCastCard.jsx";
import {useEffect, useState} from "react";
import HorizontalPodcastLoader from "@/Loader/HorizontalPodcastLoader";
import LatestPodcast from "@/components/LatestPodcast";
import { toast } from "@/hooks/use-toast";
import PopularPodcast from "@/components/PopularPodcast";


function HomePage() {
    const [allPodcast, setAllPodcast] = useState([]);
    const [isLoadingPodcast, setIsLoadingPodcast] = useState(true);
    const [latestPodcast , setLatestPodcast] = useState([]);
    const [popularPodcast , setPopularPodcast] = useState([]);


    async function handleAllPodcastData() {
        try {
            setIsLoadingPodcast(true);
            const res = await fetch("/api/get-all-podcast", {
                method: "GET"
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
            setTimeout(()=>   setIsLoadingPodcast(false) , 1000);
        }
    }

    async function handleLatestPodcast(){
        try{
            const res = await fetch("/api/get-latest-podcast");
            const data = await res.json();
            if(data?.success){
                setLatestPodcast(data?.podcastData);
            }else{
                toast({
                    title : data?.message,
                    variant : "destructive"
                })
            }
        }catch(e){
            console.log(e);
        }
    }

    async function handlePopularPodcast() {
        try{
            
            const res = await fetch("/api/get-popular-podcast");
            const data = await res.json();
            if(data?.success){
                setPopularPodcast(data?.podcastData);
            }else{
                toast({
                    title : data?.message,
                    variant : "destructive"
                })
            }
        }catch(e){
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
            <section className="flex flex-col gap-3 px-2">
                <h1 className="text-20 font-bold text-white-1">
                    Trending Podcast
                </h1>
            <div>
                {isLoadingPodcast ? (
                    <div className="mt-5 flex gap-5 overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 px-2z-20">
                        <HorizontalPodcastLoader cardLength={allPodcast?.length}/>
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
            <LatestPodcast data={latestPodcast}/>
            <PopularPodcast data={popularPodcast}/>
        </div>
    )
}

export default HomePage;