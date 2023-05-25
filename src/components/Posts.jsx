import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import { useDispatch, useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((state) => state.posts);
  const { data } = useSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);
  const userId = data.userId ? data.userId : null;

  const generalPost = posts.filter((post) => post.author._id !== userId);

  const toggleComments = (postId) => {
    setShowComments({
      ...showComments,
      [postId]: !showComments[postId],
    });
  };

  return (
    <>
      {generalPost.length > 0 ? (
        generalPost.map((post) => {
          return (
            <div className="card post-card" key={post._id}>
              <div className="card-body post-content">
                {post.author && (
                  <h6 key={post.author._id} className="ml-3 text-muted">
                    {post.author.username}
                  </h6>
                )}
                {post.content}
              </div>
              <div className="card-body">
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
                      <i className="bi bi-eye-slash"></i> mostrar comentarios
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
                          {comment.author.username}
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
          );
        })
      ) : (
        <div className="col">No hay publicaciones aun.</div>
      )}
    </>
  );
};

export default Posts;
