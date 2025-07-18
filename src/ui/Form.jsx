import { useEffect, useState } from "react";
import Button from "./Button";

import { getRandomId } from "../util/helpers";
import { useInteractive } from "../../CommentContext/useInteractive";

function Form({
  displayForm,
  displayName,
  // imagesReply,

  comment,
  defaultContent = "",
}) {
  const { user, addComment, addReply } = useInteractive();
  const [content, setContent] = useState(defaultContent);

  console.log(comment);
  useEffect(() => {
    setContent(defaultContent);
  }, [defaultContent]);

  // const { isLoading } = useComments();
  // console.log(isLoading, "loading...");

  // console.log(handleComment, "content");
  // console.log(displayName, "name");
  const handleSubmit = (e) => {
    e.preventDefault();

    const id = getRandomId();
    const timestamp = Date.now();

    const newComment = {
      content,
      createdAt: timestamp,
      id,
      score: 1,
      replies: [],
      user: {
        image: {
          png: user?.image?.png || "./images/avatars/image-juliusomo.png",
          webp: user?.image?.webp || "./images/avatars/image-juliusomo.webp",
        },
        username: "juliusomo",
      },
    };

    const reply = {
      id: getRandomId(),
      content: content,
      createdAt: timestamp,
      score: 1,
      replyingTo: displayName,
      user: {
        image: { png: user?.image?.png },
        username: "juliusomo",
      },
    };

    if (!displayForm) addComment(newComment);
    if (displayForm) addReply(reply, comment);

    setContent("");
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
        {displayForm ? "REPLY" : "SEND"}
      </Button>
    </form>
  );
}

export default Form;
