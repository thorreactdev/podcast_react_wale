import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm'

// eslint-disable-next-line react/prop-types
const ChatBubble = ({ type, text }) => {
  const isQuestion = type === "question";

  return (
    <div className={`flex ${isQuestion ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          md:max-w-[80%] text-[12px] md:text-sm p-4 rounded-lg font-semibold
          ${
            isQuestion
              ? "text-white-1 border-none bg-red-800"
              : "bg-green-800 text-white-1 "
          }
        `}
      >
        <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
      </div>
    </div>
  );
};

export default ChatBubble;
