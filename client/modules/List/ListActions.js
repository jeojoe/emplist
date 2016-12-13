import callApi from '../../util/apiCaller';

// Export constants
export const ADD_LISTS = 'ADD_LISTS';

export function addListFeeds(lists) {
  return {
    type: ADD_LISTS,
    lists,
  };
}

export function fetchListFeeds() {
  return (dispatch) => {
    return callApi('/lists', 'get').then(res => {
      dispatch(addListFeeds(res.lists));
    });
  };
}
