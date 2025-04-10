import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatTime } from "@/lib/formatTime";


// eslint-disable-next-line react/prop-types
const LatestPodcast = ({ data }) => {

  return (
    <div className="px-2">
      <div className="flex justify-between">
        <h1 className="text-white-1 text-20 font-semibold">Latest Podcast</h1>
        <Link to="/discover" className="text-orange-1 text-sm font-semibold">
          See all
        </Link>
      </div>
      <section className="pt-3">
        <Table>
          <TableBody>
            {/* // eslint-disable-next-line react/prop-types */}
            {data?.map((podcast, index) => (
              <TableRow key={podcast?._id}>
                <TableCell className="">
                  <div className="flex gap-3 items-center">
                    <span className="text-white-1 text-[10px]">
                        {index + 1}
                    </span>
                    <Link to={`/podcast-details/${podcast?._id}`}>
                    <img
                      src={podcast?.imageUrl}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-sm"
                      alt="podcast_thumbnail"
                    />
                    </Link>
                    <span className="text-white-1 line-clamp-1 text-sm font-semibold max-md:hidden">
                      {podcast?.podcastTitle}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 items-center">
                    <img
                      src="/icons/headphone.svg"
                      alt="headphone"
                      className="w-6 h-6"
                    />
                    <span className="text-white-1 text-sm font-semibold">
                      {podcast?.views}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <img src="/icons/watch.svg" className="w-6 h-6" />
                    <span className="text-sm font-semibold text-white-1">
                      {formatTime(podcast?.audioDuration)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                    <img src="/icons/three-dots.svg" className="rotate-90 w-6 h-6 cursor-pointer"/>
                    
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default LatestPodcast;
