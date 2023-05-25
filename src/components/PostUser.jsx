import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import { useDispatch, useSelector } from "react-redux";
import { removePost } from "../redux/actions/postActions.js";
const PostUser = () => {
  const { posts } = useSelector((state) => state.posts);
  const { data } = useSelector((state) => state.auth);

  const [showComments, setShowComments] = useState(false);
  const [success, setSuccess] = useState("");

  const userId = data.userId ? data.userId : null;
  const token = data.token;

  const dispatch = useDispatch();

  const userPosts = posts.filter((post) => post.author._id === userId);
  const toggleComments = (postId) => {
    setShowComments({
      ...showComments,
      [postId]: !showComments[postId],
    });
  };
  const handleDeletePost = async (postId) => {
    try {
      const res = await dispatch(removePost(postId, token));
      setSuccess(res.data.message);
      setTimeout(() => {
        setSuccess("");
        window.location.reload(true);
      }, 2500);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <h4 className="mt-1 mb-1">Tus publicaciones</h4>
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
      {userPosts.length > 0 ? (
        userPosts
          .filter((post) => post.author._id === userId)
          .map((post) => {
            return (
              <div key={post._id}>
                <div className="card post-card">
                  <div className="row">
                    <div className="card-body col-md-9 post-content">
                      {post.author && (
                        <h6 key={post.author._id} className="ml-3 text-muted">
                          Tu
                        </h6>
                      )}
                      {post.content}
                    </div>
                    <div className="col mt-3">
                      <button
                        className="btn"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        <i
                          className="bi bi-trash"
                          style={{ fontSize: "1.3em", color: "#F35C5C" }}
                        ></i>
                      </button>
                    </div>
                  </div>
                  <div className="mx-2">
                    <Comment postId={post._id} userId={userId} />
                  </div>
                  <div className="card-body">
                    <div
                      onClick={() => toggleComments(post._id)}
                      className="show-comment"
                    >
                      {showComments[post._id] ? (
                        <span className="text-muted">
                          <i className="bi bi-eye"></i> ocultar comentarios
                        </span>
                      ) : (
                        <span className="text-muted">
                          <i className="bi bi-eye-slash"></i> mostrar
                          comentarios
                        </span>
                      )}
                    </div>
                  </div>
                  {showComments[post._id] &&
                    post.comments &&
                    post.comments.length > 0 && (
                      <div className="comments mx-3">
                        {post.comments.map((comment) => (
                          <div className="comment">
                            <div className="col comment-user text-muted mb-1">
                              {comment.author._id === userId
                                ? "Tu"
                                : comment.author.username}
                            </div>
                            <div className="col-md-7">
                              <label className="comment-text">
                                {comment.content}
                              </label>
                            </div>
                            <hr />
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            );
          })
      ) : (
        <div className="col myPost text-muted">
          No tienes publicaciones aun.
        </div>
      )}
    </>
  );
};
export default PostUser;
