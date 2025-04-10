/* eslint-disable react/prop-types */
import { useCallback } from "react";
import { DotButton, useDotButton } from "./EmblaCarouselButton";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Header from "./Header";
import {  useNavigate } from "react-router-dom";

 // eslint-disable-next-line react/prop-types
const EmblaCarousel = ({ options , top }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

  const onNavButtonClick = useCallback((emblaApi) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;
    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );

  const navigate = useNavigate();

  return (
    <section
      className="flex w-full flex-col gap-4 overflow-hidden mt-10 pb-10"
      ref={emblaRef}
    >
      <div className="flex">
        {top?.map((p)=>(
          <figure key={p?._id} className="carousel_box" onClick={()=> navigate(`/podcast-details/${p?._id}`)}>
            <img src={p?.imageUrl} alt="card" className="rounded-xl border-none absolute"/>
            <div className="glassmorphism-black relative z-10 flex flex-col rounded-b-xl p-4">
              <h2 className="text-14 font-semibold text-white-1">{p?.podcastTitle}</h2>
              <p className="text-12 font-normal text-white-2">{p?.podcastCreator}</p>
            </div>
          </figure>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            selected={index === selectedIndex}
          />
        ))}
      </div>

      <section className="pt-5 w-full flex flex-col">
      <Header headerTitle="Top Podcast View"/>
       <div className="pt-5 flex flex-col gap-3 pb-5">
       {top?.map((p)=> (
          <div key={p?._id} className="flex items-center justify-between cursor-pointer" onClick={()=> navigate(`/podcast-details/${p?._id}`)}>
            <div className="flex items-start gap-2">
              <img src={p?.imageUrl} alt={p?.imageUrl} className="w-14 h-14 rounded-md"/>
              <div className="flex flex-col gap-1">
                <p className="text-white-1 text-[12px] line-clamp-1 font-semibold">
                  {p?.podcastTitle}
                </p>
                <p className="text-white-1 font-semibold text-[12px] truncate">
                  {p?.podcastCreator}
                </p>
              </div>
            </div>
            <span className="text-[12px] font-semibold">
              {p?.views}
            </span>
          </div>
        ))}
       </div>
      </section>
    </section>
  );
};

export default EmblaCarousel;
