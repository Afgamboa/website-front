import { LOGIN_SUCCESS, LOGIN_FAIL } from "../actions/types.js";

const initialState = {
    posts: [],
    authenticated: false,
    user: null
  };

  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_SUCCESS:
        return {
          ...state,
          authenticated: true,
          user: action.payload
        };
      case LOGIN_FAIL:
        return {
          ...state,
          authenticated: false,
          user: null
        };
      default:
        return state;
    }
  };

  export default authReducer;

  