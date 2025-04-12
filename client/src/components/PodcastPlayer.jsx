import { useAudio } from "@/context/AudioContext";
import { Progress } from "@/components/ui/progress";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { formatTime } from "@/lib/formatTime";
import ColorTheif from "colorthief";

const PodcastPlayer = () => {
  const { audio } = useAudio();
  let audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgGradient, setBgGradient] = useState(
    "linear-gradient(to right, #000, #222, #444)"
  );

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = audio?.imageUrl;

    img.onload = () => {
      const colortheif = new ColorTheif();
      const colors = colortheif.getPalette(img, 3);
      if (colors && colors?.length >= 2) {
        const [r1, g1, b1] = colors[0];
        const [r2, g2, b2] = colors[1];
        const [r3 , g3 , b3] = colors[2];
        setBgGradient(
          `linear-gradient(to right, rgb(${r1},${g1},${b1}), rgb(${r2},${g2},${b2}) , rgb(${r3},${g3},${b3}))`
        );
      }
    };
  }, [audio?.imageUrl]);

  function togglePlayPause() {
    if (audioRef?.current?.paused) {
      audioRef?.current?.play();
      setIsPlaying(true);
    } else {
      audioRef?.current?.pause();
      setIsPlaying(false);
    }
  }

  function toggleMute() {
    if (audioRef?.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted((prevMute) => !prevMute);
    }
  }

  function forward() {
    if (
      audioRef?.current &&
      audioRef?.current?.currentTime &&
      audioRef?.current?.duration &&
      audioRef?.current?.currentTime + 5 < audioRef?.current?.duration
    ) {
      audioRef.current.currentTime += 5;
    }
  }

  function rewind() {
    if (audioRef?.current && audioRef?.current?.currentTime - 5 > 0) {
      audioRef.current.currentTime -= 5;
    } else if (audioRef?.current) {
      audioRef.current.currentTime = 0;
    }
  }

  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateCurrentTime);

      return () => {
        audioElement.removeEventListener("timeupdate", updateCurrentTime);
      };
    }
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audio?.audioUrl) {
      if (audioElement) {
        audioElement.play().then(() => {
          setIsPlaying(true);
        });
      }
    } else {
      audioElement?.pause();
      setIsPlaying(false);
    }
  }, [audio]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className={cn("sticky bottom-0 left-0 flex size-full flex-col z-30", {
        hidden: !audio?.audioUrl || audio?.audioUrl === "",
      })}
    >
      <Progress
        value={(currentTime / duration) * 100}
        className="w-full"
        // max={duration}
      />
      <section
        className="glassmorphism-black flex h-[112px] md:h-[90px] flex-col md:flex-row w-full md:items-center md:justify-between px-4 py-2 md:py-0 gap-2 md:px-12"
        style={{ background: bgGradient }}
      >
        <audio
          src={audio?.audioUrl}
          ref={audioRef}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
          className="hidden"
        />
        <div className="flex items-center gap-4">
          <Link>
            <img
              src={audio?.imageUrl || "/images/player1.png"}
              alt="thumbnail"
              className="hidden md:block w-[48px] h-[48px] rounded-md aspect-square"
            />
          </Link>
          <div className="flex w-full md:w-[180px] flex-col gap-0.5">
            <h2 className="text-white-1 font-bold text-center text-sm truncate pt-2">
              {audio?.title}
            </h2>
            <span className="hidden md:block text-white-1 text-sm font-semibold">
              {audio?.podcastCreator}
            </span>
          </div>
        </div>

        <div className="pt-3 flex-center cursor-pointer gap-3 md:gap-6">
          <div className="flex items-center gap-1.5">
            <img
              src="/icons/reverse.svg"
              className="w-[30px] h-[30px] cursor-pointer"
              alt="rewind"
              title="rewind back 5s"
              onClick={rewind}
            />
            <span className="text-white-1 text-sm font-semibold">-5</span>
          </div>
          <img
            src={isPlaying ? "/icons/Pause.svg" : "/icons/Play.svg"}
            onClick={togglePlayPause}
            alt="play pause"
            className="w-[32px] h-[32px]"
          />
          <div className="flex items-center gap-1.5">
            <span className="text-white-1 text-sm font-semibold">+5</span>
            <img
              src="/icons/forward.svg"
              className="w-[30px] h-[30px] cursor-pointer"
              alt="forward"
              title="forward 5s"
              onClick={forward}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <h2 className="text-white-1 font-bold text-sm max-md:hidden">
            {formatTime(duration)}
          </h2>
          <div className="max-md:hidden flex items-center justify-center w-full gap-2">
            <img
              src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
              alt="mute unmute"
              className="w-[30px] h-[30px] cursor-pointer"
              onClick={toggleMute}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PodcastPlayer;
