import {
  HiMinus,
  HiPencil,
  HiPlus,
  HiPlusSm,
  HiReply,
  HiTrash,
} from "react-icons/hi";
import Form from "./Form";
import FormEdit from "./FormEdit";
import { useCallback, useState } from "react";
import { useInteractive } from "../../CommentContext/useInteractive";

function SessionReply({
  reply,

  toggleReply,

  displayForm,
  comment,
}) {
  const { user, deleteReply } = useInteractive();
  const [isEditingReply, setIsEditingReply] = useState(false);

  const isCurrentUser =
    user?.username &&
    (reply?.user?.username === user.username ||
      comment?.user?.username === user.username);

  const handleDelete = useCallback(
    (e) => {
      e.preventDefault();
      deleteReply({ parentId: comment.id, replyId: reply.id });
    },
    [comment.id, deleteReply, reply.id],
  );

  return (
    <div className="ml-7 flex flex-col space-y-3">
      <div className="commentBox grid rounded-lg bg-white px-4 py-3">
        <div className="user my-3 flex items-center justify-baseline space-x-5">
          <img
            className="h-10 w-10"
            src={reply?.user?.image.png || null}
            alt=""
          />
          <p className="font-rubik text-neutral-grey-500 text-sm font-bold">
            {reply?.user?.username || "juliusomo"}
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

        {isCurrentUser ? (
          <div className="mr-4 flex space-x-5 text-lg font-bold">
            <button
              type="button"
              // disabled={isPosting}
              onClick={handleDelete}
              className="flex cursor-pointer items-center space-x-1 text-red-500"
            >
              <span>
                <HiTrash />
              </span>{" "}
              <span>Delete</span>
            </button>
            <button
              onClick={() => setIsEditingReply(true)}
              className="text-primary-purple-600 flex cursor-pointer items-center space-x-1"
            >
              <span>
                <HiPencil />
              </span>{" "}
              <span>Edit</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => toggleReply(reply.id)}
            className="reply hover:text-primary-purple-200 text-primary-purple-600 m flex cursor-pointer items-center space-x-1.5 p-5 text-sm font-medium"
          >
            <span>
              <HiReply />
            </span>
            <span>Reply</span>
          </button>
        )}
      </div>
      {displayForm === reply.id && (
        <Form
          user={user}
          replys={reply}
          displayForm={true}
          comment={comment.id}
        />
      )}
      {isEditingReply && (
        <FormEdit
          reply={reply}
          defaultValue={reply.content}
          isEditingReply={isEditingReply}
          commentID={comment.id}
        />
      )}
    </div>
  );
}

export default SessionReply;
