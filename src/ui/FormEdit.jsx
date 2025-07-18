import { useState } from "react";
import Button from "./Button";
import { useInteractive } from "../../CommentContext/useInteractive";

function FormEdit({
  defaultValue = "",
  comment,
  reply,
  commentID,
  isEditingReply,
}) {
  const { handleUpdateComment, user, handleUpdateReply } = useInteractive();
  const [content, setContent] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditingReply) {
      handleUpdateReply(commentID, reply, content);
    } else {
      handleUpdateComment(comment.id, content);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="formBox animate-down my-2 grid h-fit gap-5 rounded-lg bg-white px-4 py-3 shadow-sm transition"
    >
      <label htmlFor="comment" className="hidden">
        Add a comment
      </label>
      <textarea
        className="textareas border-neutral-grey-100 focus:ring-primary-purple-200 focus:outline-primary-purple-600 rounded-lg border p-3 pb-7 focus:ring-2 focus:outline-1 md:rounded-xl"
        type="text"
        placeholder="Add a comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <img className="image h-12 w-12" src={user?.image?.png} alt="" />

      <Button
        disabled={!content}
        type="submit"
        className="send bg-primary-purple-600 hover:bg-primary-purple-200 cursor-pointer rounded-sm px-5 text-lg text-white md:h-12"
      >
        Edit
      </Button>
    </form>
  );
}

export default FormEdit;
