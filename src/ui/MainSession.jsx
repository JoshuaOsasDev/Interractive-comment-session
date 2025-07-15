import Session from "./Session";
import { apiFetchComments, apiFetchUser } from "../service/useApiFecth";

import { useCallback, useEffect, useReducer } from "react";

const API_URL = "http://localhost:3001/currentUser";
const API_URL_COM = "http://localhost:8080/comments";

const initailState = {
  isLoading: false,
  errors: null,
  comments: [],
  user: [],
};

const reducer = function (state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "reject":
      return { ...state, errors: action.payload };

    case "comments":
      return { ...state, comments: action.payload, isLoading: false };

    case "users":
      return { ...state, user: action.payload, isLoading: false };

    case "createComments":
      return {
        ...state,
        isLoading: false,
        comments: [...state.comments, action.payload],
      };

    case "deletetItem":
      return {
        ...state,
        isLoading: false,
        comments: state.comments.filter((prev) => prev.id !== action.payload),
      };

    case "addReply":
      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (comment.id === action.payload.parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), action.payload.reply],
            };
          }
          return comment;
        }),
      };

    default:
      throw new Error("Unkown Action");
  }
};

function MainSession() {
  // FECTH FOR USER
  // const { user } = useUser();

  // const { comments, isLoading, setComments } = useComments();

  // const { addComment, deleteComment } = useCommentMutations({
  //   comments,
  //   setComments,
  // });

  const [{ isLoading, user, comments }, dispatch] = useReducer(
    reducer,
    initailState,
  );

  //GET COMMENTS
  useEffect(() => {
    async function getComments() {
      dispatch({ type: "loading" });
      try {
        const data = await apiFetchComments();
        dispatch({ type: "comments", payload: data });
      } catch (error) {
        console.log(error.message);
        dispatch({
          type: "reject",
          payload: "there was an error loading commnets",
        });
      }
    }
    getComments();
  }, []);

  //GET USERS
  useEffect(() => {
    async function getUsers() {
      dispatch({ type: "loading" });
      try {
        const data = await apiFetchUser();
        dispatch({ type: "users", payload: data });
      } catch (error) {
        dispatch({ type: "reject", payload: error.message });
      }
    }

    getUsers();
  }, []);

  const addComment = useCallback(async (newPost) => {
    // dispatch({ type: "loading" });
    try {
      const res = await fetch(API_URL_COM, {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text(); // safely read even if not JSON
        throw new Error(text || "Failed to add comment");
      }

      const data = await res.json();
      dispatch({ type: "createComments", payload: data });
    } catch (error) {
      dispatch({ type: "reject", payload: error.message });
    }
  }, []);

  //DELETE COMMENT
  const deleteComment = useCallback(async (id) => {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${API_URL_COM}/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      dispatch({ type: "deletetItem", payload: data });
    } catch (error) {
      dispatch({ type: "reject", payload: error.message });
    }
  }, []);

  // REPLY / EDIT COMMENTS
  const addReply = useCallback(async (reply, parentId) => {
    dispatch({ type: "loading" });
    // console.log(reply, parentId, "REPLY");

    try {
      // Fetch the original comment
      const res = await fetch(`${API_URL_COM}/${parentId}`);
      if (!res.ok) throw new Error("Failed to fetch comment");
      const parentComment = await res.json();

      // Update replies array
      const updatedReplies = [...(parentComment.replies || []), reply];

      // Patch the comment with new replies
      const updateRes = await fetch(`${API_URL_COM}/${parentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ replies: updatedReplies }),
      });

      if (!updateRes.ok) throw new Error("Failed to update replies");

      dispatch({
        type: "addReply",
        payload: { parentId, reply },
      });
    } catch (error) {
      dispatch({ type: "reject", payload: error.message });
    }
  }, []);

  console.log(comments, "comments");
  return (
    <main className="bg-neutral-grey-100">
      <Session
        user={user}
        comments={comments}
        // setComments={setComments}
        isLoading={isLoading}
        addComment={addComment}
        deleteComment={deleteComment}
        dispatch={dispatch}
        addReply={addReply}
      />
    </main>
  );
}

export default MainSession;
