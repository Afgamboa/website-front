import { GET_COMMENT, DELETE_COMMENT, ADD_COMMENT, ADD_REPLY } from "../actions/types.js";

const initialState = {
  comments: [],
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMMENT:
      return { ...state, comments: action.payload };
    case DELETE_COMMENT:
      return {
        ...state,
      };
    case ADD_COMMENT:
      return {
        ...state,
        comments: [action.payload, ...state.comments]
      };
      case ADD_REPLY:
      return {
        ...state,
        comments: [...state, action.payload]
      };
    default:
      return state;
  }
};

export default authReducer;
