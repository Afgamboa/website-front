import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/Comment.css";
import { fetchComments, addComment } from "../redux/actions/commentActions";
import { useDispatch, useSelector } from "react-redux";

const Comment = (props) => {
  const postId = props.postId;
  const userId = props.userId;
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState("");
  const [replyInputValue, setReplyInputValue] = useState("");
  const [errors, setErrors] = useState("");
  const { data } = useSelector((state) => state.auth);
  const token = data.token;

  const handleSubmit = async (event) => {
    const errors = {}
    event.preventDefault();
    try {
      await dispatch(
        addComment({
          content: newComment,
          author: userId,
          post: postId,
        })
      );
      setNewComment("");
      window.location.reload(true)
    } catch (error) {
      errors.comment = error.message
      setErrors(errors);
      setTimeout(() => {
        setErrors("");
      }, 2500);
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
  return (
    <div className="input-group">
      <input
        className={`comment-input ${errors.comment ? "is-invalid" : ""}`}
        value={newComment}
        onChange={(event) => setNewComment(event.target.value)}
        placeholder="Escribe un comentario..."
      />
      <button className="btn " style={{backgroundColor: 'white', height: '30px'}} onClick={handleSubmit}>
        <i className="bi bi-send-check-fill " style={{color: 'black'}}></i>
      </button>
      {errors && errors.comment && <div className="invalid-feedback">{errors.comment}</div>}
    </div>
  );
};

export default Comment;
