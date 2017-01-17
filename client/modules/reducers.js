/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import list from './List/ListReducer';
import intl from './Intl/IntlReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  list,
  intl,
  // intl,
});
