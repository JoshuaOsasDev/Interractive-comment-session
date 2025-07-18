import { createContext, useMemo } from "react";

import { apiFetchComments, apiFetchUser } from "../src/service/useApiFecth";
import { useCallback, useEffect, useReducer } from "react";

const InteractiveContent = createContext();

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

    case "comment/deleted":
      return {
        ...state,
        comments: state.comments.filter(
          (comment) => comment.id !== action.payload,
        ),
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
        isLoading: false,
      };

    case "delete/reply":
      return {
        ...state,
        isLoading: false,
        comments: state.comments.map((comment) => {
          if (comment.id === action.payload.parentId) {
            return {
              ...comment,
              replies: (comment.replies || []).filter(
                (reply) => reply.id !== action.payload.replyId,
              ),
            };
          }
          return comment;
        }),
      };

    case "editComment":
      return {
        ...state,
        isLoading: false,
        comments: state.comments.map((comment) =>
          comment.id === action.payload.id
            ? { ...comment, content: action.payload.content }
            : comment,
        ),
      };

    case "editReply":
      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (comment.id === action.payload.parentId) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === action.payload.replyId
                  ? { ...reply, content: action.payload.content }
                  : reply,
              ),
            };
          }
          return comment;
        }),
      };

    default:
      throw new Error("Unkown Action");
  }
};

const InteractiveProvider = function ({ children }) {
  const [{ isLoading, user, comments }, dispatch] = useReducer(
    reducer,
    initailState,
  );

  //GET COMMENTS

  const getComments = useCallback(async () => {
    dispatch({ type: "loading" });
    try {
      const data = await apiFetchComments();
      dispatch({ type: "comments", payload: data });
    } catch (error) {
      if (error.name !== "AbortError") {
        dispatch({ type: "reject", payload: "error loading comments" });
      }
    }
  }, []);

  console.log("App rendered");

  useEffect(() => {
    getComments();
  }, [getComments]);

  //GET USERS

  const getUsers = useCallback(async function getUsers() {
    dispatch({ type: "loading" });
    try {
      const data = await apiFetchUser();
      dispatch({ type: "users", payload: data });
    } catch (error) {
      dispatch({ type: "reject", payload: error.message });
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

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
    // dispatch({ type: "loading" });
    try {
      const res = await fetch(`${API_URL_COM}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete comment");

      dispatch({ type: "comment/deleted", payload: id });
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  // REPLY / EDIT COMMENTS
  const addReply = useCallback(async (reply, parentId) => {
    // dispatch({ type: "loading" });
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

  const deleteReply = useCallback(async ({ parentId, replyId }) => {
    // dispatch({ type: "loading" });

    try {
      // 1. Fetch parent comment
      const res = await fetch(`${API_URL_COM}/${parentId}`);
      if (!res.ok) throw new Error("Failed to fetch parent comment");
      //  console.log(!res.ok);

      const parentComment = await res.json();

      // 2. Remove the reply from the replies array
      const updatedReplies = (parentComment.replies || []).filter(
        (reply) => reply.id !== replyId,
      );

      // 3. PATCH the parent comment with updated replies
      const updateRes = await fetch(`${API_URL_COM}/${parentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ replies: updatedReplies }),
      });

      if (!updateRes.ok) throw new Error("Failed to delete reply");

      // 4. Update local state
      dispatch({
        type: "delete/reply",
        payload: { parentId, replyId },
      });
    } catch (error) {
      dispatch({ type: "reject", payload: error.message });
    }
  }, []);

  const handleUpdateComment = useCallback(async (commentId, updateContent) => {
    // dispatch({ type: "loading" });
    try {
      const res = await fetch(`${API_URL_COM}/${commentId}`);
      if (!res.ok) throw new Error("Comment not found");

      const exitingComment = await res.json();

      const updatedComment = { ...exitingComment, content: updateContent };

      const updateRes = await fetch(`${API_URL_COM}/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: updateContent }),
      });

      if (!updateRes.ok) throw new Error("Failed to update comment");

      dispatch({ type: "editComment", payload: updatedComment });
    } catch (error) {
      console.log(error.message);
      dispatch({ type: "reject", payload: error.message });
    }
  }, []);

  const handleUpdateReply = useCallback(
    async (parentId, reply, updatedContent) => {
      // 1. Fetch parent comment
      const res = await fetch(`http://localhost:8080/comments/${parentId}`);
      const parent = await res.json();

      // 2. Modify the reply's content
      const updatedReplies = parent.replies.map((r) =>
        r.id === reply.id ? { ...r, content: updatedContent } : r,
      );

      // 3. Patch the updated replies
      await fetch(`http://localhost:8080/comments/${parentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ replies: updatedReplies }),
      });

      dispatch({
        type: "editReply",
        payload: {
          parentId,
          replyId: reply.id,
          content: updatedContent,
        },
      });
    },
    [],
  );

  const value = useMemo(() => {
    return {
      user: user,
      comments: comments,
      addComment,
      addReply,
      deleteComment,
      deleteReply,
      handleUpdateComment,
      handleUpdateReply,
      isLoading,
    };
  }, [
    user,
    comments,
    addComment,
    deleteComment,
    deleteReply,
    handleUpdateComment,
    handleUpdateReply,
    addReply,
    isLoading,
  ]);

  return (
    <InteractiveContent.Provider value={value}>
      {children}
    </InteractiveContent.Provider>
  );
};

export { InteractiveContent, InteractiveProvider };
