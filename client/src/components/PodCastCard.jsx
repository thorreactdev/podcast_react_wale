import {useNavigate} from "react-router-dom";
// eslint-disable-next-line react/prop-types
function PodCastCard({ imgURL , title , description , podcastId}) {
    const navigate = useNavigate();

    function handleViews(){
        navigate(`/podcast-details/${podcastId}`);
    }
    return(
        <div className="w-[180px] cursor-pointer hover:scale-95 transition-all duration-300 pb-3 flex-shrink-0" onClick={handleViews}>
            <figure className="flex flex-col gap-2">
                <img src={imgURL} alt={title} className="rounded-lg aspect-square w-full h-full md:w-[190px] md:h-[190px] "/>
                <div className="flex flex-col">
                    <h1 className="text-sm line-clamp-1 font-extrabold text-white-1">
                        {title}
                    </h1>
                    <h2 className="text-white-4 text-12 line-clamp-1 font-medium">
                        {description}
                    </h2>
                </div>
            </figure>
        </div>
    )
}

export default PodCastCard;