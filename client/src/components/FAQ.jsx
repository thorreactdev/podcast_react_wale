import { useEffect, useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader } from "lucide-react";
import EmptyState from "./EmptyState";

// eslint-disable-next-line react/prop-types
const FAQ = ({ episodeId }) => {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchFAQData() {
    try {
      setLoading(true);
      const res = await fetch(`/api/most-asked-question/${episodeId}`);
      const data = await res.json();
      if (data?.success) {
        setFaqData(data?.mostAskedFAQ);
      } else {
        toast.error(data?.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (episodeId) {
      fetchFAQData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeId]);

  return (
    <div className="mt-7">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-white-1 text-18 font-semibold">Most Asked Questions about the podcast</h1>
        <span className="text-white-2 text-sm font-semibold">
            The below questions are based on the most asked questions by users. You can ask your own question as well.
        </span>
      </div>
      
        {loading ? (
          <Loader className="animate-spin text-orange-1" />
        ) : faqData?.length > 0 ? (
          faqData?.map((item) => (
            <Accordion type="single" collapsible key={item?._id} className="">
            <AccordionItem value="item-1">
              <AccordionTrigger>{item?.question}</AccordionTrigger>
              <AccordionContent>
                <ReactMarkdown>
                   {item?.answer?.slice(0,300) + "..."}
                </ReactMarkdown>
              </AccordionContent>
            </AccordionItem>
            </Accordion>
          ))
        ) : (
          <div>
            <EmptyState title="Sorry No FAQ  is available"/>
          </div>
        )}
     
    </div>
  );
};

export default FAQ;
