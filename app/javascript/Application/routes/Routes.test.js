import React from 'react'
import { shallow } from 'enzyme'
import { Routes } from './'
import { Route, Switch } from 'react-router-dom'
import { navigation } from '../util/constants'
import RoleRedirect from './RoleRedirect'

describe('<Router />', () => {
  describe('#render', () => {
    const getWrapper = () => shallow(<Routes />)
    const getLength = component => getWrapper().find(component).length

    const testRoute = (path, navigateTo) => {
      const mockRoute = {
        location: {},
        match: {
          params: {
            clientId: '1',
          },
        },
      }

      const route = getWrapper()
        .find(Route)
        .find({ path })
      expect(route.exists()).toBe(true)
      expect(route.props().exact).toBe(true)

      const page = route.props().children(mockRoute)
      expect(page.props.navigateTo).toBe(navigateTo)
    }

    it('renders with 1 <Switch /> component', () => {
      expect(getLength(Switch)).toBe(1)
    })

    it('renders a root route that redirects based on Role', () => {
      const route = getWrapper()
        .find(Route)
        .find({ path: '/' })
      expect(route.exists()).toBe(true)
      expect(route.props().exact).toBe(true)
      expect(route.find(RoleRedirect).exists()).toBe(true)
    })

    it('renders a client list route', () => {
      testRoute('/clients', navigation.CHILD_LIST)
    })

    it('renders a new client route', () => {
      testRoute('/clients/new', navigation.CHILD_PROFILE_ADD)
    })

    it('renders a child profile route', () => {
      testRoute('/clients/:clientId', navigation.CHILD_PROFILE)
    })

    it('renders a child profile edit route', () => {
      testRoute('/clients/:clientId/edit', navigation.CHILD_PROFILE_EDIT)
    })

    it('renders a child assessments route', () => {
      testRoute('/clients/:clientId/assessments', navigation.ASSESSMENT_ADD)
    })

    it('renders a child assessment edit route', () => {
      testRoute(
        '/clients/:clientId/assessments/:id',
        navigation.ASSESSMENT_EDIT
      )
    })

    it('renders a search route', () => {
      testRoute('/search', navigation.CLIENT_SEARCH)
    })

    it('renders a supervisor dashboard route', () => {
      testRoute('/staff', navigation.STAFF_LIST)
    })
  })
})
