import { combineReducers } from 'redux';

import authReducer from './authReducer';
import registerReducer from './registerReducer';
import userReducer from './userReducer';
import usersReducer from './usersReducer';
import messageReducer from './messageReducer';
import productReducer from './productReducer';
import productsReducer from './productsReducer';

export default combineReducers({
  auth: authReducer,
  register: registerReducer,
  message: messageReducer,
  user: userReducer,
  users: usersReducer,
  product: productReducer,
  products: productsReducer,
});
