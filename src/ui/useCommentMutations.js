import { useCallback } from "react";
import {
  apiRequest,
  handleDeleteApi,
  useComments,
} from "../service/useApiFecth";
import { getRandomId } from "../util/helpers";

export const useCommentMutations = () => {
  const { comments, setComments } = useComments();
  console.log(comments, "comments in API");

  const addComment = useCallback(
    async (content) => {
      const newComment = {
        content,
        createdAt: Date.now(),
        id: getRandomId(),
        score: 1,
        replies: [],
        user: {
          image: {
            png: "./images/avatars/image-juliusomo.png",
            webp: "./images/avatars/image-juliusomo.webp",
          },
          username: "juliusomo",
        },
      };

      setComments((prev) => [...prev, newComment]);

      try {
        await apiRequest({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newComment),
        });
      } catch (error) {
        setComments((prev) => prev.filter((c) => c.id !== newComment.id));
        throw error;
      }
    },
    [setComments],
  );

  const deleteComment = async (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));

    try {
      await handleDeleteApi(id);
    } catch (error) {
      setComments((prev) => [...prev, comments.find((c) => c.id === id)]);
      throw error;
    }
  };

  return { addComment, deleteComment };
};
