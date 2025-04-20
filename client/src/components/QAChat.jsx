import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { SendHorizonal } from "lucide-react";
import ChatBubble from "./ChatBubble";
import TypingLoader from "./TypingLoader";
import { toast } from "sonner";
import TweetModal from "@/model/TweetModal";

// eslint-disable-next-line react/prop-types
const QAChat = ({ podcastId, transcription }) => {
  const [userQuestion, setUserQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setModalOpen] = useState(false);
  const [modalLoader, setModalLoader] = useState(false);
  const [tweet, setTweet] = useState([]);
;

  async function handleAskQuestion(e) {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    const question = userQuestion.trim();
    setChat((prev) => [...prev, { type: "question", text: question }]);
    setUserQuestion("");
    setLoading(true);
    try {
      const res = await fetch("/api/ask-question", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: document.cookie,
        },
        body: JSON.stringify({
          question: userQuestion,
          episodeId: podcastId,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setChat((prev) => [...prev, { type: "answer", text: data?.faqData }]);
      } else {
        toast.error(data?.message || "Something went wrong. Try again.");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setChat((prev) => [
        ...prev,
        { type: "answer", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleTweet() {
    setModalLoader(true);
    try {
      const res = await fetch("/api/get-tweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: document.cookie,
        },
        body: JSON.stringify({ context: transcription }),
      });
      const data = await res.json();
      if (data?.success) {
        const tweets = data?.tweets?.trim()?.split(/\n\s*\n/)?.slice(1,);
        setTweet(tweets);
      } else {
        toast.error(data?.message || "Something went wrong. Try again.");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setModalLoader(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 pt-10 pb-5">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-white-1 font-bold text-18">
            Ask Questions about the podcast
          </h1>
          <span className="text-sm text-white-2 font-semibold">
            The model will answer based on the podcast you are listening.
          </span>
        </div>
        <div>
          <Button
            onClick={() => {
              setModalOpen(true);
              handleTweet();
            }}
            className="text-white-1 text-[13px] font-semibold bg-black-1 border border-black-4 md:w-[200px] hover:bg-black-2 duration-300 transition-all"
          >
            Generate Tweet
          </Button>
        </div>
      </div>

      <div className="bg-black-2 rounded-lg">
        {chat.length > 0 ? (
          chat.map((msg, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-2 h-auto overflow-y-auto  p-6  shadow-xl"
            >
              <ChatBubble type={msg.type} text={msg.text} />
            </div>
          ))
        ) : (
          <div />
        )}
        {loading && <TypingLoader />}
      </div>

      <form onSubmit={handleAskQuestion}>
        <div className="mt-4 relative flex items-center">
          <Textarea
            rows={3}
            className="input-class resize-none focus-visible:ring-black-5 py-5 text-white-1"
            placeholder="Ask Your Question Here..."
            onChange={(e) => setUserQuestion(e.target.value)}
            value={userQuestion}
            disabled={loading}
          />
          <Button
            className="absolute right-2 bottom-4 bg-black-2 px-3 h-8"
            title="send"
            type="submit"
            disabled={loading}
          >
            <SendHorizonal className="text-white-1 h-4 w-4" size={14} />
          </Button>
        </div>
      </form>
      {openModal && (
        <TweetModal
          onClose={() => setModalOpen(false)}
          modalLoader={modalLoader}
          tweet={tweet}
        />
      )}
    </div>
  );
};

export default QAChat;
