import { ADD_LISTS } from './ListActions';

// Initial State
const initialState = { feedsLoading: false, feeds: [] };

const ListReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_LISTS :
      return {
        feeds: action.lists,
      };
    default :
      return state;
  }
};

/* Selectors */
// Get all lists
export const getListFeeds = state => state.lists.data;

export default ListReducer;
