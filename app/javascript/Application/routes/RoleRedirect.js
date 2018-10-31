import React from 'react'
import { Redirect } from 'react-router'
import UserAccountService from '../components/common/UserAccountService'
import { LoadingState } from '../util/loadingHelper'

class RoleRedirect extends React.PureComponent {
  constructor() {
    super()
    this.state = {
      loadingState: LoadingState.updating,
      user: null,
    }
  }
  async componentDidMount() {
    const user = await UserAccountService.fetchCurrent()
    this.setState({
      loadingState: LoadingState.ready,
      user,
    })
  }

  render() {
    const { loadingState, user } = this.state

    if (loadingState !== LoadingState.ready && loadingState !== LoadingState.error) {
      return null
    }

    if (user && user.roles && user.roles.includes('Supervisor')) {
      return <Redirect to={'/staff'} />
    }
    return <Redirect to={'/clients'} />
  }
}

export default RoleRedirect
