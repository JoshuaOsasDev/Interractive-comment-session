import { HiMinus, HiPlus, HiPlusSm, HiReply } from "react-icons/hi";
import Form from "./Form";

import SessionComments from "./SessionComments";
import SessionReply from "./SessionReply";

function Session({
  user,
  comments,
  isLoading,
  setComments,
  addComment,
  deleteComment,
  dispatch,
  addReply,
}) {
  if (isLoading) return <p>Loading....</p>;
  return (
    <section className="font-rubik mx-auto flex min-h-screen max-w-screen-md flex-col px-5 py-10 md:px-4 md:py-7">
      <div className="mx-auto grid gap-4">
        {comments.map((comment) => {
          return (
            <SessionComments
              comment={comment}
              key={comment.id}
              setComments={setComments}
              user={user}
              deleteComment={deleteComment}
              isPosting={isLoading}
              dispatch={dispatch}
              addReply={addReply}
            />
          );
        })}

        {/* reply */}
        {/* <div className="ml-8 grid gap-4 border-l-2 border-l-gray-200">
          {comments
            .filter((comment) => comment?.replies?.length > 0)
            .map((comment) =>
              comment?.replies.map((reply) => {
                return <SessionReply key={reply.id} reply={reply} />;
              }),
            )}
        </div> */}
        <Form user={user} addComment={addComment} />
      </div>
    </section>
  );
}

export default Session;
