import { HiMinus, HiPlus, HiPlusSm, HiReply } from "react-icons/hi";
import Form from "./Form";

import { useState } from "react";
import { HiPencil, HiTrash } from "react-icons/hi2";
import SessionReply from "./SessionReply";
import FormEdit from "./FormEdit";
import { useInteractive } from "../../CommentContext/useInteractive";

function SessionComments({ comment }) {
  const { deleteComment, isLoading: isPosting, user } = useInteractive();

  const [displayForm, setDisplayForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteComment(comment.id);
  };

  const toggleReply = (id) => {
    setDisplayForm((prev) => (prev === id ? !prev : id));
  };

  // const handleComment = (parendId, reply) => {
  //   dispatch({ type: "addReply", payload: { parendId, reply } });
  // };
  return (
    <div className="flex flex-col space-y-3 transition duration-300">
      <div
        id={comment?.user?.username}
        className="commentBox grid rounded-lg bg-white px-4 py-3"
        key={comment.id}
      >
        <div className="user my-3 flex items-center justify-baseline space-x-5">
          <img className="h-10 w-10" src={comment?.user?.image.png} alt="" />
          <div className="font-rubik text-neutral-grey-500 text-sm font-bold">
            {comment?.user?.username === user?.username ? (
              <p className="flex items-center space-x-2">
                <span> {comment?.user?.username} </span>

                <span className="bg-primary-purple-600 rounded-sm p-1 px-2 text-white">
                  you
                </span>
              </p>
            ) : (
              comment?.user?.username
            )}{" "}
          </div>
          <span className="text-neutral-grey-500">1 mouth ago</span>
        </div>

        <p className="text text-neutral-grey-500 text-sm">{comment.content}</p>

        <div className="vote bg-neutral-grey-50 my-3 flex w-fit items-center space-x-2 rounded-lg px-2 py-2 md:mr-2 md:flex-col md:items-center md:justify-center md:space-y-4">
          <button className="hover:text-primary-purple-600 text-primary-purple-200">
            <HiPlus className="h-4 w-4 cursor-pointer" />
          </button>
          <span className="text-primary-purple-600 text-sm font-medium">
            {comment?.score}
          </span>
          <button className="hover:text-primary-purple-600 text-primary-purple-200 cursor-pointer">
            <HiMinus className="h-4 w-4" />
          </button>
        </div>

        {comment?.user?.username === user?.username ? (
          <div className="mr-4 flex space-x-5 text-lg font-bold">
            <button
              type="button"
              disabled={isPosting}
              onClick={handleDelete}
              className="flex cursor-pointer items-center space-x-1 text-red-500"
            >
              <span>
                <HiTrash />
              </span>{" "}
              <span>Delete</span>
            </button>
            <button
              onClick={() => setIsEditing((prev) => !prev)}
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
            onClick={() => toggleReply(comment?.id)}
            className="reply hover:text-primary-purple-200 text-primary-purple-600 m flex cursor-pointer items-center space-x-1.5 p-5 text-sm font-medium"
          >
            <span>
              <HiReply />
            </span>
            <span>Reply</span>
          </button>
        )}
      </div>
      {displayForm === comment.id && (
        <Form
          displayForm={displayForm}
          displayName={comment?.user?.username}
          imagesReply={comment?.user?.image.png}
          comment={comment.id}
        />
      )}
      {isEditing && (
        <FormEdit comment={comment} defaultValue={comment?.content} />
      )}
      {/* REPLY */}
      <div className="ml-8 grid gap-4 border-l-2 border-l-gray-200">
        {comment.replies.map((reply) => (
          <SessionReply
            key={reply.id}
            reply={reply}
            toggleReply={toggleReply}
            displayForm={displayForm}
            comment={comment}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        ))}
      </div>
    </div>
  );
}

export default SessionComments;
