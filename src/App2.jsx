import { useEffect, useState } from "react";

function App2() {
  const API_URL_COM = "http://localhost:3001/comments";
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getComments() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(API_URL_COM);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.log(error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    getComments();
  }, []);

  async function deleteComment(id) {
    try {
      const res = await fetch(`${API_URL_COM}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Could not delete comment");
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  }

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleDel = function (e) {
    e.preventDefault(); // Prevent default behavior

    deleteComment(id);
  };
  return (
    <div>
      {comments.length === 0 && !isLoading && <div>No comments found</div>}
      {comments.map((comment) => (
        <div key={comment.id}>
          <h2>{comment.id}</h2>
          <button type="button" onClick={handleDel}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App2;
