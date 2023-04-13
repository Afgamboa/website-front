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

export const addComment = ({ content, author, post }) => async (dispatch) => {
    const token = localStorage.getItem("token");
    const comment = {
      post: post.toString(),
      author: author,
      content: content,
    };
    try {
      const response = await axios.post(
        `http://localhost:3001/api/comments/new/${post}`,
        { comment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Adjuntar el token en el encabezado
          },
        }
      );
      console.log("first", response)
      dispatch({
        type: ADD_COMMENT,
        payload: response.data,
      });
    } catch (error) {
      console.error(error);
    }
  };
