import React from 'react'
import PropTypes from 'prop-types'
import { GlobalHeader } from 'react-wood-duck'
import { trimSafely, addTrailingSlash } from '../../util/formatters'
import UserAccountService from './UserAccountService'

const logoutUrl = `${addTrailingSlash(process.env.CANS_BASE_PATH)}user/logout`

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      userInitials: '..',
    }
  }

  componentDidMount() {
    this.fetchUser()
  }

  fetchUser = () => {
    return UserAccountService.fetchCurrent()
      .then(this.onFetchSuccess)
      .catch(() => {})
  }

  onFetchSuccess = staffPerson => {
    this.updateNameAndInitials(staffPerson)
    this.invokeCallback(staffPerson.staff_id)
  }

  updateNameAndInitials = staffPerson => {
    const userName = this.parseUserName(staffPerson)
    const userInitials = this.parseUserInitials(staffPerson)
    this.setState({
      userName,
      userInitials,
    })
  }

  parseUserName = staffPerson => {
    const firstName = trimSafely(staffPerson.first_name)
    const lastName = trimSafely(staffPerson.last_name)
    return `${firstName} ${lastName}`
  }

  parseUserInitials = staffPerson => {
    const firstName = trimSafely(staffPerson.first_name)
    const firstLetter = firstName.length > 0 ? firstName[0] : ''
    const lastName = trimSafely(staffPerson.last_name)
    const secondLetter = lastName.length > 0 ? lastName[0] : ''
    return '' + firstLetter + secondLetter
  }

  invokeCallback = staffId => {
    const { onUserFetchedCallback } = this.props
    if (onUserFetchedCallback) {
      onUserFetchedCallback(staffId)
    }
  }

  logout() {
    window.location.href = logoutUrl
  }

  render = () => {
    const { userName, userInitials } = this.state
    return (
      <GlobalHeader
        profileName={userName}
        profileId={userInitials}
        profileAvatar={userInitials}
        logoutCallback={this.logout}
      />
    )
  }
}

Header.propTypes = {
  /** callback to be invoked when user info is successfully fetched,
   * should accept staffId as a parameter */
  onUserFetchedCallback: PropTypes.func,
}

Header.defaultProps = {
  onUserFetchedCallback: null,
}

export default Header
