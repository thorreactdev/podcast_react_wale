/* eslint-disable react/prop-types */
import TweetCard from "@/components/TweetCard"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


import { Loader } from "lucide-react"

// eslint-disable-next-line react/prop-types
const TweetModal = ({ onClose , modalLoader , tweet }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
       {modalLoader ? (
        <div className="flex items-center justify-center h-[15vh] gap-2 font-semibold">
            <Loader className="animate-spin text-orange-1"/> Generating
        </div>
       ) : (
        <>
        <DialogHeader>
          <DialogTitle>Genearted Tweet</DialogTitle>
          <DialogDescription className="text-sm font-semibold">
            Please check the tweet once before tweeting.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center flex-col gap-3">
        {tweet?.map((item, index)=>(
            <TweetCard
            key={index}
            index={index}
            tweet={item}
            />
        ))}
          
        </div>
        <DialogFooter className="md:justify-end">
          <DialogClose asChild>
            <Button type="button" className="bg-black-2">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
        </>

       )}
        
      </DialogContent>
    </Dialog>
  )
}

export default TweetModal