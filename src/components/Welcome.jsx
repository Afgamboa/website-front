import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Comment from "./Comment";
import "./css/Welcome.css";
import { Navigate } from 'react-router-dom';


const userId = "64272ec71ca4460dec65a5b7";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Mjc3ODRlMWJmYzY3ZjhlZjExYjFmMyIsImlhdCI6MTY4MTE1MTUyNywiZXhwIjoxNjgxMjM3OTI3fQ.hkqFdVeuUoc3ZBTPwmgKq8w6Ho4Q04LNYu5VCR5lCVQ"
const Welcome = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");


  const handleNewPostContentChange = (event) => {
    setNewPostContent(event.target.value);
  };
  const successAlert = document.querySelector("#success-alert");

  const handleCreatePost = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/posts/new",
        { author: userId, content: newPostContent, title: newPostTitle },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewPostContent("");
      setNewPostTitle("");
      setPosts([response.data, ...posts]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:3001/api/posts/delete/${postId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Adjuntar el token en el encabezado
        },
      });
      setPosts(posts.filter((post) => post.id !== postId));
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {}, [posts]);

  useEffect(() => {}, [authors]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/posts/view", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Adjuntar el token en el encabezado
        },
      });
      setPosts(response.data);
      const authorIds = response.data.map((post) => post.author);
      const uniqueAuthorIds = [...new Set(authorIds)];
      const authorResponses = await Promise.all(
        uniqueAuthorIds.map((id) =>
          axios.get(`http://localhost:3001/api/auth/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      const newAuthors = authorResponses.map((response) => response.data.name);
      setAuthors(newAuthors);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  function handleLogout() {
    localStorage.clear();
     <Navigate to="/login" />;
  }

  return (
    <div className="container-post">
      <button className="btn btn-secondary btn-sm position-absolute top-0 right-0" onClick={handleLogout}>
        Cerrar sesión
      </button>
      <form onSubmit={handleCreatePost} className="create-post-form">
        <input
          className="form-control rounded-pill"
          value={newPostContent}
          onChange={handleNewPostContentChange}
          placeholder="¿Qué estás pensando?"
        />

        <div className="form-group">
          <button type="submit" className="btn btn-primary btn-md">
            Publicar
          </button>
        </div>
      </form>
      <hr />
      {!isLoading && posts.length === 0 && (
        <div className="alert alert-info text-center">
          No hay publicaciones aún.
        </div>
      )}
      {!isLoading && (
        <div>
          <h2 className="text-center">Mis publicaciones</h2>
          <div className="my-posts">
            {posts
              .filter((post) => post.author === userId)
              .map((post) => (
                <>
                <div className="row" key={post.id}>
                  <div className="col-md-8">
                    <h5 className="card-title">{post.title}</h5>
                    <label className="card-text">{post.content}</label>
                    <div className="ml-4">
                      <Comment postId={post._id} userId={userId} />
                    </div>
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
              
              ))}
          </div>

          <h2 className="text-center">Otras publicaciones</h2>
          <div className="card-deck">
          {posts
            .filter((post) => post.author !== userId)
            .map((post) => (
              <div  key={post.id}>
                <div className="d-flex">
                  <h5 className="card-title mx-2">{post.title}</h5>
                  <div className="text-muted">
                    {authors
                      .filter((author) => author._id === post.author)
                      .map((author) => (
                        <h6 key={author.id} className="ml-3">{author.username}</h6>
                      ))}
                  </div>
                </div>
                <p className="card-text">{post.content}</p>

                <Comment postId={post._id} userId={userId} />
              </div>
            ))}
        </div>

        </div>
      )}
    </div>
  );
};

export default Welcome;
