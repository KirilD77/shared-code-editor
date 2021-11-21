import { createStore, combineReducers } from 'redux';
import authReducer from './reducers/authReducer';

const reducers = combineReducers({
  userAuth: authReducer
});
const store = createStore(reducers);
window['store'] = store;
export default store;
