import PodCastCard from "./PodCastCard"


const PopularPodcast = ({ data }) => {
  return (
    <div className="pb-10 md:pb-0">
        <div>
            <h1 className="text-white-1 text-20 font-semibold">
                Popular Podcast
            </h1>
        </div>
        <section className="mt-5 flex gap-5 overflow-x-scroll">
            {data?.map((podcast)=>(
                <PodCastCard
                key={podcast._id}
                podcastId={podcast._id}
                imgURL={podcast.imageUrl}
                description={podcast.podcastDescription}
                title={podcast.podcastTitle}
            />
            ))}
        </section>
    </div>
  )
}

export default PopularPodcast