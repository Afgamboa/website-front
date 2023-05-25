import axios from 'axios';
import { LOGIN_SUCCESS, LOGIN_FAIL } from './types.js';

const AuthUser = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', { email, password }, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return dispatch({
      type: LOGIN_SUCCESS,
      payload: response.data
    });

  } catch (error) {
    return dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data.message
    });
  }
};

export { AuthUser }
