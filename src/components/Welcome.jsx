import React, { useState, useEffect } from "react";
import Posts from "./Posts";
import PostUser from "./PostUser";
import "./css/Welcome.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPosts, createPost } from "../redux/actions/postActions.js";

const Welcome = () => {
  const [newPostContent, setNewPostContent] = useState("");
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.auth);
  const history = useNavigate();
  const userId = data.userId;
  const token = data.token;
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    dispatch(fetchPosts(token));
  }, [dispatch]);

  const handleNewPostContentChange = (event) => {
    setNewPostContent(event.target.value);
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    try {
      const res = await dispatch(
        createPost(
          {
            content: newPostContent,
          },
          token,
          userId
        )
      );
      if (res && res.status === 201) {
        setNewPostContent("");
        setSuccess(res.data.message);
        setTimeout(() => {
          setSuccess("");
          window.location.reload(true);
        }, 2500);
      }
    } catch (error) {
      setErrors(error.message);
      setTimeout(() => {
        setErrors("");
      }, 2500);
      console.log(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    history("/");
  };

  return (
    <div className="container-post">
      <div className="create-post row">
        <div className="col">
          <input
            className="form-control rounded-pill"
            value={newPostContent}
            onChange={handleNewPostContentChange}
            placeholder="Que estas pensando?"
          />
        </div>
        <div className="col-md-5">
          <button
            type="submit"
            className="btn btn-dark newPost"
            onClick={handleCreatePost}
          >
            Publicar
          </button>
        </div>
        <div className="col">
          <button
            type="button"
            className="btn btn-danger closed"
            onClick={handleLogout}
          >
            Cerrar sesion
          </button>
        </div>
      </div>
      <hr />
      {errors && (
        <div
          className="alert alert-danger alert-sm mt-3 mb-4"
          style={{ width: 400, margin: "auto" }}
        >
          {errors}
        </div>
      )}
      {success && (
        <div
          className="alert alert-success alert-sm mt-3 mb-4"
          style={{
            width: 400,
            height: 50,
            margin: "auto",
            textAlign: "center",
          }}
        >
          <h6>{success}</h6>
        </div>
      )}
      <div className="row mx-2" style={{ width: "99%" }}>
        <div className="col post-container">
          <Posts />
        </div>

        <div className="col post-container">
          <PostUser />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
