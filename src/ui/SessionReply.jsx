import { HiMinus, HiPlus, HiPlusSm, HiReply } from "react-icons/hi";
import Form from "./Form";

function SessionReply({ reply }) {
  return (
    <div className="commentBox ml-7 grid rounded-lg bg-white px-4 py-3">
      <div className="user my-3 flex items-center justify-baseline space-x-5">
        <img
          className="h-10 w-10"
          src={reply?.user?.image.png || null}
          alt=""
        />
        <p className="font-rubik text-neutral-grey-500 text-sm font-bold">
          {reply?.user?.username}
        </p>
        <span className="text-neutral-grey-500">1 mouth ago</span>
      </div>

      <p className="text text-neutral-grey-500 text-sm">
        <span className="text-primary-purple-600 font-bold">
          <a href={`#${reply.replyingTo}`}>@{reply?.replyingTo} </a>
        </span>
        {reply.content}
      </p>

      <div className="vote bg-neutral-grey-50 my-3 flex w-fit items-center space-x-2 rounded-lg px-2 py-2 md:mr-2 md:flex-col md:items-center md:justify-center md:space-y-4">
        <button className="hover:text-primary-purple-600 text-primary-purple-200">
          <HiPlus className="h-4 w-4 cursor-pointer" />
        </button>
        <span className="text-primary-purple-600 text-sm font-medium">
          {reply.score}
        </span>
        <button className="hover:text-primary-purple-600 text-primary-purple-200 cursor-pointer">
          <HiMinus className="h-4 w-4" />
        </button>
      </div>

      <button className="reply hover:text-primary-purple-200 text-primary-purple-600 m flex cursor-pointer items-center space-x-1.5 p-5 text-sm font-medium">
        <span>
          <HiReply />
        </span>
        <span>Reply</span>
      </button>
    </div>
  );
}

export default SessionReply;
