import React from 'react';
import sListItem from '../../List/components/ListItem.css';

const CompanyItem = ({ company }) => {
  const {
    company_name,
    company_image,
  } = company;
  return (
    <div>
      <img
        src={company_image}
        alt={`${company_name}'s logo`}
        className={sListItem.image}
      />
      <p>{company_name}</p>
    </div>
  );
};

CompanyItem.propTypes = {
  company: React.PropTypes.object.isRequired,
};

export default CompanyItem;
