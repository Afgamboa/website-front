import axios from "axios";
import { SET_POSTS, ADD_POST, DELETE_POST } from "./types.js";
import jwtDecode from "jwt-decode";
const BASE_API_URL = "http://localhost:3001/api";

export const setPosts = (payload) => ({
  type: SET_POSTS,
  payload,
});

export const addPost = (payload) => ({
  type: ADD_POST,
  payload,
});

export const deletePost = (payload) => ({
  type: DELETE_POST,
  payload,
});

export const fetchPosts = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);
  localStorage.setItem("userId", decode.id)
  try {
    const response = await axios.get(`${BASE_API_URL}/posts/view`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    dispatch(setPosts(response.data));

  } catch (error) {
    console.log(error.message);
  }
};

export const createPost = ({ content, author }) => async (dispatch) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${BASE_API_URL}/posts/new`,
      { content, author },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    dispatch(addPost(response.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const removePost = (postId) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`${BASE_API_URL}/posts/delete/${postId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    dispatch(deletePost(postId));
  } catch (error) {
    console.log(error.message);
  }
};