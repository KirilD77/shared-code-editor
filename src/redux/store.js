import { createStore, combineReducers, applyMiddleware } from 'redux';
import authReducer from './reducers/authReducer';
import thunk from 'redux-thunk';
import { editorReducer } from './reducers/editorReducer';

const reducers = combineReducers({
  userAuth: authReducer,
  editor: editorReducer
});
const store = createStore(reducers, applyMiddleware(thunk));
window['store'] = store;
export default store;
