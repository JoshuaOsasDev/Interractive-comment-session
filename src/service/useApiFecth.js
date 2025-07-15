import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:8080/currentUser";
const API_URL_COM = "http://localhost:8080/comments";

export async function apiFetchUser() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch user");
  return await response.json();
}

export async function apiFetchComments() {
  const response = await fetch(API_URL_COM);
  if (!response.ok) throw new Error("Failed to fetch user");
  return await response.json();
}

// async function apiFecthPost(api, optionObj) {
//   const res = await fetch(api, optionObj);
//   if (!res.ok) throw new Error("Failed to post update");
//   return await res.json();
// }

export function useUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getUser() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiFetchUser();
        setUser(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }

    getUser();
  }, []);

  return { user, isLoading, error };
}

export const useComments = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const getComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetchComments();
      // console.log(isLoading, "loading");
      setComments(data);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getComments();
  }, [getComments]);

  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(false);
  // useEffect(() => {
  //   async function getComments() {
  //     setIsLoading(true);
  //     setError(null);
  //     try {
  //       const data = await apiFetchComments();
  //       setComments(data);
  //     } catch (err) {
  //       console.Error(err.message);
  //       setError(err.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   getComments();
  // }, []);

  return { comments, isLoading, error, setComments };
};

export async function apiRequest(optionObj = null) {
  try {
    const response = await fetch(API_URL_COM, optionObj);
    if (!response.ok) throw new Error("Request failed");
    return await response.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function handleDeleteApi(id) {
  try {
    const response = await fetch(`${API_URL_COM}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Delete failed");
    return true;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
