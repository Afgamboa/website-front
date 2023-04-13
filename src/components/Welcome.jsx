import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import "./css/Welcome.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchPosts,
  createPost,
  removePost,
} from "../redux/actions/postActions.js";

const Welcome = () => {
  const [newPostContent, setNewPostContent] = useState("");
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const history = useNavigate();
  const userId = localStorage.getItem("userId");
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);
  console.log("first", posts);
  const handleNewPostContentChange = (event) => {
    setNewPostContent(event.target.value);
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    try {
      dispatch(
        createPost({
          content: newPostContent,
          author: userId,
        })
      );
      setNewPostContent("");
      dispatch(fetchPosts());
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      dispatch(removePost(postId));
      dispatch(fetchPosts());
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    history("/");
  };

  const toggleComments = (postId) => {
    setShowComments({
      ...showComments,
      [postId]: !showComments[postId],
    });
  };

  return (
    <div className="container-post">
      <form onSubmit={handleCreatePost} className="create-post-form">
        <input
          className="form-control rounded-pill"
          value={newPostContent}
          onChange={handleNewPostContentChange}
          placeholder="Que estas pensando?"
        />

        <div className="form-group">
          <button type="submit" className="btn btn-primary btn-md">
            Publicar
          </button>
          <button
            type="button"
            className="btn btn-dark btn-md ml-2"
            onClick={handleLogout}
          >
            Cerrar sesion
          </button>
        </div>
      </form>
      <hr />
      {
        <div>
          <h2 className="text-center">Mis publicaciones</h2>
          <div className="my-posts">
            {posts.length > 0 ? (
              posts
                .filter((post) => post.author._id === userId)
                .map((post) => (
                  <>
                    <div className="row">
                      <div className="col-md-8">
                        <label key={post._id} className="card-text">
                          {post.content}
                        </label>
                        <button
                          onClick={toggleComments}
                          className="show-comment btn btn-link"
                        >
                          {showComments
                            ? "Ocultar comentarios"
                            : "Ver comentarios"}
                        </button>
                        {showComments &&
                          post.comments &&
                          post.comments.length > 0 && (
                            <div className="comments">
                              <h6 className="text-muted">Comentarios</h6>
                              <ul className="comment-list">
                                {post.comments.map((comment) => (
                                  <li key={comment._id}>
                                    <div className="comment">
                                      <label className="comment-text">
                                        {comment.content}
                                      </label>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                      <div className="col-md-3 d-flex align-items-center justify-content-end">
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeletePost(post._id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </>
                ))
            ) : (
              <div className="alert alert-info text-center">
                No tienes publicaciones aun
              </div>
            )}
          </div>

          <h2 className="text-center">Otras publicaciones</h2>
          <div className="aling-items-start">
            {posts &&
              posts
                .filter((post) => post.author._id !== userId)
                .map((post) => (
                  <>
                    <div key={post._id}>
                      <div className="d-flex">
                        <div className="text-muted">
                          {post.author && (
                            <h6 key={post.author._id} className="ml-3">
                              {post.author.username}
                            </h6>
                          )}
                        </div>
                      </div>
                      <p className="card-text">{post.content}</p>
                      <Comment postId={post._id} userId={userId}/>
                    </div>
                    <button
                      onClick={() => toggleComments(post._id)}
                      className="show-comment btn btn-link"
                    >
                      {showComments[post._id] ? (
                        <i className="bi bi-eye-slash"></i>
                      ) : (
                        <i className="bi bi-eye"></i>
                      )}
                    </button>
                        <hr />
                    {showComments[post._id] &&
                      post.comments &&
                      post.comments.length > 0 && (
                        <div className="comments">
                          <h6 className="text-muted">Comentarios</h6>
                          <ul className="comment-list">
                            {post.comments.map((comment) => (
                              <li key={comment._id}>
                                <div className="comment">
                                  <label className="comment-text">
                                    {comment.content}
                                  </label>
                                </div>
                                <hr />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </>
                ))}
          </div>
        </div>
      }
    </div>
  );
};

export default Welcome;
