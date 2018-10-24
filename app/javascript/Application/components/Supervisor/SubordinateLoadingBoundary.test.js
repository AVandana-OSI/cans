import React from 'react'
import { shallow } from 'enzyme'
import SubordinateLoadingBoundary from './SubordinateLoadingBoundary'
import { LoadingState } from '../../util/loadingHelper'
import SubordinateService from './Subordinate.service'

jest.mock('./Subordinate.service')

describe('<SubordinateLoadingBoundary />', () => {
  const render = () =>
    shallow(
      <SubordinateLoadingBoundary>
        <div />
      </SubordinateLoadingBoundary>,
      { disableLifecycleMethods: true }
    )

  it('starts in a waiting state', () => {
    const wrapper = render()
    expect(wrapper.state().loadingState).toBe(LoadingState.waiting)
    expect(wrapper.state().subordinates).toEqual([])
  })

  it('starts loading subordinate list on mount', () => {
    const subordinateFetchSpy = jest.spyOn(SubordinateService, 'fetch')
    subordinateFetchSpy.mockReturnValue([])

    const wrapper = render()
    wrapper.instance().componentDidMount()

    expect(wrapper.state().loadingState).toBe(LoadingState.updating)
  })

  it('readies itself once subordinates are fetched', async () => {
    const subordinates = ['Alice', 'Bob']
    const subordinateFetchSpy = jest.spyOn(SubordinateService, 'fetch')
    subordinateFetchSpy.mockReturnValue(subordinates)

    const wrapper = render()
    await wrapper.instance().componentDidMount()

    expect(wrapper.state().loadingState).toBe(LoadingState.ready)
    expect(wrapper.state().subordinates).toBe(subordinates)
  })

  describe('when waiting', () => {
    it('passes loading state to child', () => {
      const wrapper = render()
      wrapper.setState({ loadingState: LoadingState.waiting })
      expect(wrapper.props()).toEqual({ loadingState: LoadingState.waiting })
    })
  })

  describe('when updating', () => {
    it('passes loading state to child', () => {
      const wrapper = render()
      wrapper.setState({ loadingState: LoadingState.updating })
      expect(wrapper.props()).toEqual({ loadingState: LoadingState.updating })
    })
  })

  describe('when ready', () => {
    it('renders child with list of subordinates', () => {
      const wrapper = render()
      wrapper.setState({ loadingState: LoadingState.ready, subordinates: ['Alice', 'Bob'] })
      expect(wrapper.props().loadingState).toBe(LoadingState.ready)
      expect(wrapper.props().staff).toEqual(['Alice', 'Bob'])
    })
  })

  describe('when in error', () => {
    it('passes loading state to child', () => {
      const wrapper = render()
      wrapper.setState({ loadingState: LoadingState.error })
      expect(wrapper.props()).toEqual({ loadingState: LoadingState.error })
    })
  })
})
