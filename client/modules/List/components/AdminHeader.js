import React from 'react';
import { Link } from 'react-router';
import callApi from '../../../util/apiCaller';

const AdminHeader = ({ list }) => {
  const approve = () => {
    const password = prompt('enter password bitch');
    callApi(`/requests/approve/${list._id}`, 'put', { password })
    .then((res, err) => {
      console.log(res);
    });
  };

  return (
    <div>
      <button className="button-primary" onClick={approve}>Approve</button>
    </div>
  );
};

export default AdminHeader;
