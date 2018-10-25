import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import './style.sass'

class SideNavLink extends PureComponent {
  render() {
    const { isActive, text, href, onClick } = this.props
    const classes = classNames('sidebar-item', { active: isActive })
    return (
      <div className={classes} onClick={() => onClick()} onKeyDown={() => onClick()} role="link" tabIndex={0}>
        <Link to={href}>{text}</Link>
      </div>
    )
  }
}

SideNavLink.propTypes = {
  href: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
}

export default SideNavLink
