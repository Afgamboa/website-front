import { LOGIN_SUCCESS, LOGIN_FAIL } from "../actions/types.js";

const initialState = {
    authenticated: false,
    data: null
  };

  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_SUCCESS:
        return { ...state, authenticated: true, data: action.payload };
      case LOGIN_FAIL:
        return {
          ...state,
          authenticated: false,
          data: null
        };
      default:
        return state;
    }
  };

  export default authReducer;

  