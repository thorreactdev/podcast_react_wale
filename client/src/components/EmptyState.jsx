import {Button} from "@/components/ui/button.jsx";
import {Link} from "react-router-dom";

function EmptyState({ title , search = true, buttonLink , buttonText}) {
    return(
        <div className="flex-center size-full flex-col gap-3 pb-12 md:pb-3">
            <img src="/icons/emptyState.svg" alt="search icon"/>
            <div className="flex-center w-full flex-col gap-3">
                <h1 className="text-white-1 font-semibold">{title}</h1>
                {search && <p className="text-center text-[14.5px] font-semibold text-white-2">
                    Try adjusting your search to find what you are looking for
                </p>}
                {buttonLink && <Button className="bg-orange-1">
                    <Link to={buttonLink} className="flex gap-2">
                        <img src="/icons/discover.svg" alt={title}/>
                        <h1 className="text-sm font-extrabold text-white-1">{buttonText}</h1>
                    </Link>
                </Button>}
            </div>

        </div>
    )
}
export default EmptyState;