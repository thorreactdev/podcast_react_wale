import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Loader } from "lucide-react";

// eslint-disable-next-line react/prop-types
const SummaryModal = ({ onClose, summary, summaryLoading }) => {
  return (
    <Drawer className="" open={true} onOpenChange={onClose}>
      <DrawerContent className="">
        <div className="md:max-w-7xl mx-auto flex items-center justify-center flex-col gap-5">
          <DrawerHeader>
            <DrawerTitle>Short Summary of the podcast</DrawerTitle>
            <DrawerDescription>
              Below is the short description of the podcast
            </DrawerDescription>
          </DrawerHeader>
          <div>
            {summaryLoading ? (
                <div className="flex-center pb-10">
                    <Loader className="text-orange-1 animate-spin"/>
                </div>
            ) : (
              <>
                <div className="text-[13px] md:text-[15px] font-medium text-justify p-4 xl:p-0">
                  {summary}
                </div>
                <DrawerFooter>
                  <DrawerClose className="flex items-center justify-center gap-2 pb-5">
                    <Button
                      variant=""
                      className="text-white-1 font-semibold bg-black-1 border border-black-4 md:w-[200px] hover:bg-black-4 transition-all duration-300"
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SummaryModal;
