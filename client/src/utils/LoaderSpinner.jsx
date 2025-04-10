import {Loader} from "lucide-react";

function LoaderSpinner() {
    return(
        <div className="flex-center w-full h-screen">
            <Loader size="24" className="animate-spin text-orange-1"/>
        </div>
    )
}
export default LoaderSpinner;