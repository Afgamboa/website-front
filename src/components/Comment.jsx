import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/Comment.css";

const token = localStorage.getItem("token");

function Comment(props) {
  const postId = props.postId;
  const userId = props.userId;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyInputValue, setReplyInputValue] = useState("");
  const [showComments, setShowComments] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/comments/view/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Adjuntar el token en el encabezado
          },
        }
      );

      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newComment.trim() === "") return;

    const comment = {
      author: userId,
      post: postId,
      content: newComment,
    };

    try {
      const response = await axios.post(
        `http://localhost:3001/api/comments/new/${postId}`,
        { comment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Adjuntar el token en el encabezado
          },
        }
      );
      setComments([...comments, response.data]);
      setNewComment("");
      fetchComments();
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
      setComments(comments.filter((c) => c.id !== commentId));
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };
  console.log(comments);
  return (
    <div className="comment-form-container">
  <form className="comment-form" onSubmit={handleSubmit}>
    <input
      className="form-control comment-input rounded-pill"
      value={newComment}
      onChange={(event) => setNewComment(event.target.value)}
      placeholder="Escribe un comentario..."
    />
  </form>
    <button onClick={toggleComments} className="show-comment btn btn-link">
      {showComments ? 'Ocultar comentarios' : 'Ver comentarios'}
    </button>
    <hr />
    {showComments && comments.length > 0 && (
      comments.map((comment) => (
        <div className="comment-card mt-3" key={comment._id}>
          <div className="comment comment-body d-flex align-items-start">
            <div className="col-sm-8">
              <label className="card-text comment-text flex-grow-1 mx-1">
                {comment.content}
              </label>
              /
              <label className=" text-muted">
                {comment.author?.username}
              </label>
              <ul className="comment-replies-list">
                {comment.childrenComments &&
                  comment.childrenComments.map((childComment) => (
                    <>
                      <label>Respuestas</label>
                      <li key={childComment._id}>
                        <div className="comment-reply">
                          <label className="comment-reply-text">
                            {childComment.content}
                          </label>
                        </div>
                        <div className="comment-reply-input-container">
                          <input
                            className="form-control-sm comment-reply-input rounded-pill"
                            type="text"
                            placeholder="Responder"
                            onChange={(event) =>
                              setReplyInputValue(event.target.value)
                            }
                          />
                        </div>
                      </li>
                    </>
                  ))}
              </ul>
            </div>
            <input
              id={`reply-${comment._id}`}
              className="form-control-sm comment-reply-input rounded-pill"
              placeholder="Escribe una respuesta..."
              onChange={(event) => setReplyInputValue(event.target.value)}
            />
            <button
              type="button"
              className="btn btn-dark btn-sm comment-reply-submit-btn mx-1 rounded-pill"
              onClick={() => handleReplySubmit(comment._id)}
            >
              Responder
            </button>
            {comment.author && comment.author._id === userId && (
              <button
                type="button"
                className="btn btn-danger btn-sm comment-delete-btn rounded-pill"
                onClick={() => handleDeleteComment(comment._id)}
              >
                Eliminar
              </button>
            )}
          </div>
          <hr />
        </div>
      ))
    )}
  </div>
  
  );
}

export default Comment;
