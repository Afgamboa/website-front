import axios from "axios";
import { SET_POSTS, ADD_POST, DELETE_POST } from "./types.js";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";
const BASE_API_URL = "http://localhost:3001/api";

export const fetchPosts = (token) => async (dispatch) => {
  const decode = jwtDecode(token);
  localStorage.setItem("userId", decode.id);
  try {
    const response = await axios.get(`${BASE_API_URL}/posts/view`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: SET_POSTS,
      payload: response.data,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const addPost = async (dispatch, data) => {
  dispatch({
    type: ADD_POST,
    payload: data,
  });
};

const deletePost = async (dispatch, data) => {
  dispatch({
    type: DELETE_POST,
    payload: data,
  });
};

export const createPost =
  ({ content }, token, author) =>
  async (dispatch) => {
    if (content.trim().length === 0) {
      throw new Error("El contenido de tu publicacion esta vacio");
    }
    try {
      const response = await axios.post(
        `${BASE_API_URL}/posts/new`,
        { content, author },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      addPost(dispatch, response.data);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  };

export const removePost = (postId, token) => async (dispatch) => {
  const confirmed = await showAlert();
  if (confirmed) {
    try {
      const response = await axios.delete(
        `${BASE_API_URL}/posts/delete/${postId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      deletePost(dispatch, response.data);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
};

function showAlert() {
  return new Promise((resolve) => {
    Swal.fire({
      icon: "question",
      html: `<h4>Seguro deseas eliminar tu publicacion?</h4>`,
      confirmButtonText: "Eliminar",
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-danger",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
