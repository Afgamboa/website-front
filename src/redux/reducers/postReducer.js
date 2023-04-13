import { SET_POSTS, DELETE_POST , ADD_POST } from "../actions/types.js";

const initialState = {
  posts: [],
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_POSTS:
      return {
        ...state,
        posts: action.payload,
      };
      case ADD_POST:
      return {
        ...state,
        posts: [...state, action.payload],
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export default postReducer;