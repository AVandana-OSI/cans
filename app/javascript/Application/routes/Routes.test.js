import React from 'react'
import { shallow } from 'enzyme'
import { executeTest } from './Routes.test.util'
import { AssessmentContainer } from '../components/Assessment'
import { ClientsContainer, ClientAddEditForm } from '../components/Client'
import { SearchContainer } from '../components/Search'
import { childInfoJson } from '../components/Client/Client.helper.test'
import { Routes } from './'
import { Route, Switch } from 'react-router-dom'
import { SupervisorDashboard } from '../components/Supervisor'
import { navigation } from '../util/constants'

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

    it('renders a client list route', () => {
      testRoute('/', navigation.CHILD_LIST)
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
      testRoute('/clients/:clientId/assessments/:id', navigation.ASSESSMENT_EDIT)
    })
    
    it('renders a search route', () => {
      testRoute('/search', navigation.CLIENT_SEARCH)
    })

    it('renders a supervisor dashboard route', () => {
      testRoute('/staff', navigation.STAFF_LIST)
    })
  })

  /**
   * To test that a configured route is working, create a new
   * test block below and pass executeTest() the component, the url and some html
   * that will be rendered from the component.
   *
   * example: the following route is defined in Routes.js:
   *   <Route path="/home" component={Home} />
   *
   * so you will pass the following:
   *   executeTest(Home, /home', 'Welcome!')
   */
  describe('route config', () => {
    describe('/', () => {
      it('navigates to clients list page', () => {
        executeTest(<ClientsContainer />, '/', '')
      })
    })

    describe('/assessments', () => {
      it('navigates to assessments', () => {
        executeTest(
          <AssessmentContainer client={childInfoJson} isNewForm={false} />,
          '/clients/:clientId/assessments',
          'Communimetric'
        )
      })
    })

    describe('/edit assessments', () => {
      it('navigates to assessments', () => {
        executeTest(
          <AssessmentContainer client={childInfoJson} isNewForm={false} />,
          '/clients/:clientId/assessments/:id',
          'Communimetric'
        )
      })
    })

    describe('/clients/new', () => {
      it('navigates to client add form page', () => {
        executeTest(<ClientAddEditForm isNewForm={true} />, '/clients/new', 'Child/Youth')
      })
    })

    describe('/clients/edit/:id', () => {
      it('navigates to client edit form page', () => {
        executeTest(<ClientAddEditForm isNewForm={false} />, '/clients/edit/:id', 'Child/Youth')
      })
    })

    describe('/search', () => {
      it('navigates to client search page', () => {
        executeTest(<SearchContainer />, '/search', 'Assessment History')
      })
    })
    
    describe('/staff', () => {
      it('navigates to the supervisor dashboard', () => {
        executeTest(<SupervisorDashboard />, '/staff', 'Assigned Staff')
      })
    })
  })
})
