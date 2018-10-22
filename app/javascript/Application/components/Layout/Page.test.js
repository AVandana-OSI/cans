import React from 'react'
import { shallow } from 'enzyme'
import { Page, SideNav } from './'
import BreadCrumbsBuilder from './BreadCrumbsBuilder'
import { childInfoJson } from '../Client/Client.helper.test'
import { ClientService } from '../Client/Client.service'
import { navigation } from '../../util/constants'
import AssessmentContainer from '../Assessment/AssessmentContainer'
import ClientAddEditForm from '../Client/ClientAddEditForm'
import Client from '../Client/Client'

describe('<Page />', () => {
  describe('layout', () => {
    const getWrapper = () =>
      shallow(<Page match={{ params: {} }} location={{}} navigateTo={navigation.ASSESSMENT_ADD} />)

    it('renders with <SideNav /> links', async () => {
      const wrapper = getWrapper()
      await wrapper.instance().componentDidMount()
      const sideNav = wrapper.find(SideNav)

      expect(sideNav.length).toBe(1)
      expect(sideNav.dive().find({ text: 'County Client List' }).length).toBe(1)
    })

    it('renders with <BreadCrumbsBuilder /> links', async () => {
      const wrapper = getWrapper()
      await wrapper.instance().componentDidMount()
      const breadCrumbsBuilder = wrapper.find(BreadCrumbsBuilder)

      expect(breadCrumbsBuilder.length).toBe(1)
    })
  })
})

describe('when adding Assessment', () => {
  const getWrapper = navigateTo =>
    shallow(<Page match={{ params: { clientId: '1001' } }} location={{}} navigateTo={navigateTo} />)

  it('renders < AssessmentContainer on Add/>', async () => {
    jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
    const wrapper = getWrapper(navigation.ASSESSMENT_ADD)
    await wrapper.instance().componentDidMount()
    expect(wrapper.find(AssessmentContainer).length).toBe(1)
  })

  it('renders < AssessmentContainer on Edit />', async () => {
    jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
    const wrapper = getWrapper(navigation.ASSESSMENT_EDIT)
    await wrapper.instance().componentDidMount()
    expect(wrapper.find(AssessmentContainer).length).toBe(1)
  })

  it('renders < ClientAddEditForm for Edit Profile/>', async () => {
    jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
    const wrapper = getWrapper(navigation.CHILD_PROFILE_EDIT)
    await wrapper.instance().componentDidMount()
    expect(wrapper.find(ClientAddEditForm).length).toBe(1)
  })

  it('renders < ClientAddEditForm for Add CANS/>', async () => {
    jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
    const wrapper = getWrapper(navigation.CHILD_PROFILE_ADD)
    await wrapper.instance().componentDidMount()
    expect(wrapper.find(ClientAddEditForm).length).toBe(1)
  })

  it('renders < Client />', async () => {
    jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
    const wrapper = getWrapper(navigation.CHILD_PROFILE)
    await wrapper.instance().componentDidMount()
    expect(wrapper.find(Client).length).toBe(1)
  })
})
