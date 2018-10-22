import React from 'react'
import PropTypes from 'prop-types'

import './style.sass'

const BreadCrumb = ({ navigationElements }) => (
  <div className="container" role="navigation">
    <div className="row">
      <div className="col-xs-7 row-padding">
        <span className={'breadcrumbs'}>
          Back to: <a href="/dashboard">DASHBOARD</a>{' '}
          {navigationElements.map((nav, index) => <span key={index}> &gt; {nav}</span>)}
        </span>
      </div>
    </div>
  </div>
)

BreadCrumb.propTypes = {
  navigationElements: PropTypes.array,
}

BreadCrumb.defaultProps = {
  navigationElements: [],
}

export default BreadCrumb
