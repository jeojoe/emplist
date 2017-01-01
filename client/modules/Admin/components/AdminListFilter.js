import React from 'react';
import c from 'classnames';

const AdminListFilter = ({ changeFilter, filter }) => (
  <div>
    <button
      className={filter === 'requests' ? 'button-primary' : 'button'}
      onClick={() => changeFilter('requests')}
    >
      Requests
    </button>
    <button
      className={filter === 'lists' ? 'button-primary' : 'button'}
      // onClick={() => changeFilter('lists')}
    >
      Lists
    </button>
    <button
      className={filter === 'companies' ? 'button-primary' : 'button'}
      // onClick={() => changeFilter('companies')}
    >
      Companies
    </button>
  </div>
);

export default AdminListFilter;
