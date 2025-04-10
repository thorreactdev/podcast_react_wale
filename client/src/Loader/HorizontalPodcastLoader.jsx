import { Skeleton } from '@/components/ui/skeleton'

// eslint-disable-next-line react/prop-types
const HorizontalPodcastLoader = ({cardLength = 4}) => {
  return (
    <>
            {
                Array.from({length: cardLength})?.map((_, index) => (
                    <div key={index} className="z-20">
                        <div className="flex flex-col space-y-3">
                            <Skeleton
                                className="h-[180px] w-[180px] bg-black-2 rounded-xl aspect-square 2xl:size-[200px]"/>
                            <div className="space-y-2">
                                <Skeleton className="h-4 bg-black-1 w-[150px]  md:w-[150px]"/>
                                <Skeleton className="h-4 bg-black-1 w-[100px]  md:w-[100px]"/>
                            </div>
                        </div>
                    </div>

                ))
            }
        </>
  )
}

export default HorizontalPodcastLoader