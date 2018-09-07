import React from 'react';
import PropTypes from 'prop-types';

const BreadCrumb = ({ navigationElements }) => (
  <div className="container">
    <div className="row">
      <div className="col-xs-7 row-padding">
        <h5>
          {' '}
          <span>
            Back to: <a href="/dashboard">DASHBOARD</a>{' '}
            {navigationElements.map((nav, index) => <span key={index}> &gt; {nav}</span>)}
          </span>
        </h5>
      </div>
    </div>
  </div>
);

BreadCrumb.propTypes = {
  navigationElements: PropTypes.array,
};

BreadCrumb.defaultProps = {
  navigationElements: [],
};

export default BreadCrumb;
