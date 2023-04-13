import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/Comment.css";
import { fetchComments, addComment } from "../redux/actions/commentActions";
import { useDispatch, useSelector } from "react-redux";

const token = localStorage.getItem("token");

const Comment = (props) => {
  const postId = props.postId;
  const userId = props.userId;
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comment);
  const [newComment, setNewComment] = useState("");
  const [replyInputValue, setReplyInputValue] = useState("");

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(
        addComment({
          author: userId,
          post: postId,
          content: newComment,
        })
      );
      setNewComment("");
      dispatch(fetchComments(postId));
    } catch (error) {
      console.log(error.message);
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
    <div className="comment-form-container">
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          className="form-control-sm comment-input rounded-pill"
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          placeholder="Escribe un comentario..."
        />
      </form>
    </div>
  );
};

export default Comment;
