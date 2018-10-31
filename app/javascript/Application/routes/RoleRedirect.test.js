import React from 'react'
import { shallow } from 'enzyme'
import { Redirect } from 'react-router'
import RoleRedirect from './RoleRedirect'
import { LoadingState } from '../util/loadingHelper'
import UserAccountService from '../components/common/UserAccountService'
jest.mock('../components/common/UserAccountService')

describe('<RoleRedirect />', () => {
  const render = () => shallow(<RoleRedirect />, { disableLifecycleMethods: true })
  it('starts in an updating state', () => {
    const wrapper = render()
    expect(wrapper.state().loadingState).toBe(LoadingState.updating)
    expect(wrapper.state().user).toBe(null)
  })

  it('starts loading user account info immediately on mount', () => {
    const fetchCurrentSpy = jest.spyOn(UserAccountService, 'fetchCurrent')
    fetchCurrentSpy.mockReturnValue({})
    const wrapper = render()
    wrapper.instance().componentDidMount()
    expect(wrapper.state().loadingState).toBe(LoadingState.updating)
    expect(fetchCurrentSpy).toHaveBeenCalledTimes(1)
  })

  it('readies itself once user account info is fetched', async () => {
    const user = { roles: ['My Role'] }
    const fetchCurrentSpy = jest.spyOn(UserAccountService, 'fetchCurrent')
    fetchCurrentSpy.mockReturnValue(user)
    const wrapper = render()
    await wrapper.instance().componentDidMount()
    expect(wrapper.state().loadingState).toBe(LoadingState.ready)
    expect(wrapper.state().user).toBe(user)
  })

  describe('when updating', () => {
    it('renders nothing', () => {
      const wrapper = render()
      wrapper.setState({ loadingState: LoadingState.updating })
      expect(wrapper.text()).toBe('')
    })
  })

  describe('when ready', () => {
    it('redirects to the staff list when the user is a Supervisor', () => {
      const wrapper = render()
      wrapper.setState({ loadingState: LoadingState.ready, user: { roles: ['CANS-worker', 'Supervisor'] } })
      const redirect = wrapper.find(Redirect)
      expect(redirect.exists()).toBe(true)
      expect(redirect.props().to).toBe('/staff')
    })

    it('redirects to the client list when the user is not a Supervisor', () => {
      const wrapper = render()
      wrapper.setState({ loadingState: LoadingState.ready, user: { roles: ['CANS-worker'] } })
      const redirect = wrapper.find(Redirect)
      expect(redirect.exists()).toBe(true)
      expect(redirect.props().to).toBe('/clients')
    })
  })

  describe('when in error', () => {
    it('redirects to the client list by default', () => {
      const wrapper = render()
      wrapper.setState({ loadingState: LoadingState.error })
      const redirect = wrapper.find(Redirect)
      expect(redirect.exists()).toBe(true)
      expect(redirect.props().to).toBe('/clients')
    })
  })
})
