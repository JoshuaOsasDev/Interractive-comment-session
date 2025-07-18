import { HiMinus, HiPlus, HiPlusSm, HiReply } from "react-icons/hi";
import Form from "./Form";

import SessionComments from "./SessionComments";
import SessionReply from "./SessionReply";
import { useInteractive } from "../../CommentContext/useInteractive";

function Session() {
  const { isLoading, comments } = useInteractive();
  if (isLoading) return <p>Loading....</p>;
  return (
    <section className="font-rubik mx-auto flex min-h-screen max-w-screen-md flex-col px-5 py-10 md:px-4 md:py-7">
      <div className="mx-auto grid gap-4">
        {comments.map((comment) => {
          return <SessionComments comment={comment} key={comment.id} />;
        })}

        <Form />
      </div>
    </section>
  );
}

export default Session;
