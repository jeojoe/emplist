/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import list from './List/ListReducer';
// import posts from './modules/Post/PostReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  list,
  // posts,
  // intl,
});
