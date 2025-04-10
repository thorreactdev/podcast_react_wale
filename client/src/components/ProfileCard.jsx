import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useAudio } from "@/context/AudioContext";

const ProfileCard = ({ imageUrl, userName, podcast, credits, email }) => {
    const { setAudio } = useAudio();
    const [randomPodcast , setRandomPodcast] = useState({});
    
    const totalViews = podcast?.reduce((acc, p)=> {
        return acc + p.views;
    }, 0)

    const handleRandomPodcast = () =>{
        const randomIndex = Math.floor(Math.random() * podcast.length);
        setRandomPodcast(podcast[randomIndex]);
    }

    useEffect(()=>{
        if(randomPodcast){
            setAudio({
                title : randomPodcast?.podcastTitle,
                audioUrl : randomPodcast?.audioUrl,
                imageUrl : randomPodcast?.imageUrl,
                podcastCreator : randomPodcast?.podcastCreator,
                podcastId : randomPodcast?._id
            })
        }
    },[randomPodcast, setAudio]);
  return (
    <div className="mt-8">
      <div className="flex md:gap-10 flex-col items-center justify-center md:items-start md:justify-start md:flex-row">
        <div>
          <img
            src={imageUrl}
            alt="user_profile_pic"
            className="w-[250px] h-[250px] object-cover rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 py-5 items-center md:items-start">
            <figure className="flex gap-2 items-center">
              <img src="/icons/verified.svg" alt="verified_account" />
              <span className="text-white-2 text-sm font-semibold">
                Verified Creator
              </span>
            </figure>
            <p className="text-white-1 text-[25px] font-bold">
                {userName}
            </p>
            
            {credits && (
                 <span className="text-sm text-white-1 font-semibold">
                 Available Credits : {credits}
               </span>
            )}
            {email && (
              <span className="text-white-2 text-sm font-semibold cursor-pointer">
                Contact Email : {email}
              </span>
            )}
          </div>
          <figure className="flex gap-2 items-center">
            <img src="/icons/headphone.svg" alt="headphone"/>
            <h2 className="text-white-1 font-semibold">
                {totalViews} &nbsp; 
                <span className="text-white-2 text-sm">Monthly Listeners</span>
            </h2>
          </figure>
          {podcast?.length > 0 && (
            <Button className="text-white-1 bg-orange-1 font-extrabold py-6 mt-5" onClick={handleRandomPodcast}>
                <img src="/icons/Play.svg" alt="play_icon" width={20} height={20}/> &nbsp; Play Random Podcast
            </Button>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ProfileCard;
