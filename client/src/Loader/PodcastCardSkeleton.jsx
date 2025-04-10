import {Skeleton} from "@/components/ui/skeleton.jsx";

// eslint-disable-next-line react/prop-types
function PodcastCardSkeleton({cardLength =8}) {
    return (
        <>
            {
                Array.from({length: cardLength})?.map((_, index) => (
                    <div key={index} className="z-20">
                        <div className="flex flex-col space-y-3">
                            <Skeleton
                                className="w-full h-full md:h-[190px] md:w-[190px] bg-black-2 rounded-xl aspect-square 2xl:size-[200px]"/>
                            <div className="space-y-2">
                                <Skeleton className="h-4 bg-black-1 w-[350px]  md:w-[150px]"/>
                                <Skeleton className="h-4 bg-black-1 w-[300px]  md:w-[100px]"/>
                            </div>
                        </div>
                    </div>

                ))
            }
        </>

    )
}

export default PodcastCardSkeleton;