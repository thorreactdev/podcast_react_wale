import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAudio } from "@/context/AudioContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function PodcastDetailPlayer({
  // eslint-disable-next-line react/prop-types
  isOwner,
  // eslint-disable-next-line react/prop-types
  podcastId,
  // eslint-disable-next-line react/prop-types
  imageUrl,
  // eslint-disable-next-line react/prop-types
  audioUrl,
  // eslint-disable-next-line react/prop-types
  podcastTitle,
  // eslint-disable-next-line react/prop-types
  podcastCreator,
  // eslint-disable-next-line react/prop-types
  creatorImageUrl,
  // eslint-disable-next-line react/prop-types
  voiceName,
  // eslint-disable-next-line react/prop-types
  userId
}) {
  const { user } = useAuth();
  // const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const { setAudio } = useAudio();
  const navigate = useNavigate();

  async function handleViews(){
    const res = await fetch(`/api/views-increment/${podcastId}`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
    });
    const data = await res.json();
    if(data?.success){
        toast.success(data?.message , {
            description : "Thankyou for listening to this podcast.",
        });
    }else{
        toast.error(data?.message);
    }
    navigate(`/podcast-details/${podcastId}`);
}

  async function handlePlay(){
    setAudio({
      title : podcastTitle,
      audioUrl,
      imageUrl,
      podcastCreator,
      podcastId
    });
    await handleViews();
  }

  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
      <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
        <img
          src={imageUrl}
          width={230}
          height={230}
          alt="podcast_image"
          className="aspect-square rounded-lg"
        />
        <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-9">
          <article className="flex flex-col gap-3 max-md:items-center">
            <h1 className="text-white-1  font-extrabold text-lg md:text-[24px] tracking-[-0.32px]">
              {podcastTitle}
            </h1>
            <Link to={`/podcaster-profile/${userId}`}>
            <figure className="flex gap-2 items-center">
              <img
                src={creatorImageUrl || user?.userAvatar}
                alt="author_profile_pic"
                className="rounded-full w-[30px] h-[30px] object-cover border border-black-4"
              />
              <h2 className="text-[14.5px] font-semibold text-white-1">
                {podcastCreator}
              </h2>
            </figure>
            </Link>
            <div className="flex items-center gap-2">
              <img
                src="/icons/headphone.svg"
                alt="waving sound"
                className="w-[30px] h-[30px] rounded-full"
              />
              <span className="text-white-1 text-[14.5px] font-bold capitalize">
                voice of {voiceName}
              </span>
            </div>
          </article>
          <Button onClick={handlePlay} className="text-16 w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1 py-6">
            <img src="/icons/Play.svg" width={20} height={20} alt="play_icon" />{" "}
            Play Podcast
          </Button>
        </div>
      </div>
      {isOwner && (
        <div
          className="relative mt-2"
          onMouseLeave={() => setIsDeleting(false)}
          onMouseEnter={() => setIsDeleting(true)}
        >
          <img
            src="/icons/three-dots.svg"
            width={20}
            height={30}
            className="cursor-pointer"
          />
          {isDeleting && (
            <div className="absolute -left-16 bg-black-4 w-20 p-2 flex flex-col gap-4 ">
              <div className="flex gap-2 items-center cursor-pointer">
                <img
                  src="/icons/delete.svg"
                  width={12}
                  height={12}
                  alt="delete_icon"
                />
                <h2 className="text-xs font-medium text-white-1">Delete</h2>
              </div>

              <div className="flex gap-2 items-center">
                <img
                  src="/icons/edit.svg"
                  width={12}
                  height={12}
                  alt="edit_icon"
                />
                <h2 className="text-xs font-medium text-white-1">
                  <Link to={`/edit-podcast-page/${podcastId}`}>Edit</Link>
                </h2>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default PodcastDetailPlayer;
