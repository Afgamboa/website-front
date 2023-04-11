import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/authReducer.js';

const rootReducer = combineReducers({
  login: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
