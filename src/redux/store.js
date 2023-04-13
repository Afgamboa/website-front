import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer.js'
import postReducer from './reducers/postReducer.js'
import commentReducer from './reducers/commentReducer.js'


const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    comment: commentReducer
  }
});

export default store;