import React from 'react';
import CompanyItem from './CompanyItem';

export default ({ companies }) => {
  return <div>{companies.map((company) => <CompanyItem key={company._id} company={company} />)}</div>;
};
