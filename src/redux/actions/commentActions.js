import axios from "axios";
import { ADD_COMMENT, GET_COMMENT } from "./types.js";

export const fetchComments = (postId) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `http://localhost:3001/api/comments/view/${postId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Adjuntar el token en el encabezado
        },
      }
    );
    dispatch({
      type: GET_COMMENT,
      payload: response.data,
    });
  } catch (error) {
    console.error(error);
  }
};

export const addComment =
  ({ content, author, post }, token) =>
  async (dispatch) => {
    if (content.trim().length === 0) {
      throw new Error("¡Tu comentario esta vacio!");
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/api/comments/new/${post}`,
        {
          content: content,
          author: author,
          post: post,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({
        type: ADD_COMMENT,
        payload: response.data,
      });
    } catch (error) {
      console.error(error);
    }
  };

const handleReplySubmit = async (commentId) => {
  if (!replyInputValue.trim()) {
    return;
  }
  try {
    const response = await axios.post(
      `http://localhost:3001/api/comments/reply/${postId}/${commentId}`,
      {
        content: replyInputValue,
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setReplyInputValue("");
    fetchComments();
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteComment = async (commentId) => {
  try {
    await axios.delete(
      `http://localhost:3001/api/comments/delete/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Adjuntar el token en el encabezado
        },
      }
    );
    fetchComments();
  } catch (error) {
    console.error(error);
  }
};
