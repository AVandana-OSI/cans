import React from 'react'
import { shallow, mount } from 'enzyme'
import Card from '@material-ui/core/Card/Card'
import Button from '@material-ui/core/Button/Button'
import CardHeader from '@material-ui/core/CardHeader/index'
import CardContent from '@material-ui/core/CardContent/index'
import Grid from '@material-ui/core/Grid/Grid'
import { MemoryRouter } from 'react-router-dom'
import { ClientAssessmentHistory } from './index'
import AssessmentService from '../Assessment/Assessment.service'
import ClientAssessmentHistoryRecord from './ClientAssessmentHistoryRecord'

jest.mock('../Assessment/Assessment.service')

const params = {
  clientId: 1004,
  location: { pathname: '/client' },
  history: { location: '/client' },
}

const getShallowWrapper = () => {
  AssessmentService.search.mockReturnValue(
    Promise.resolve([
      { id: 1, person: { id: 100 }, county: { name: 'Yolo' } },
      { id: 2, person: { id: 200 }, county: { name: 'Yolo' } },
    ])
  )
  return shallow(<ClientAssessmentHistory {...params} />)
}

const prepareWrapper = async mockedAssessments => {
  // given
  AssessmentService.search.mockReturnValue(Promise.resolve(mockedAssessments))
  const wrapper = shallow(<ClientAssessmentHistory {...params} />)

  // when
  await wrapper.instance().componentDidMount()
  wrapper.update()
  return wrapper
}

describe('<ClientAssessmentHistory', () => {
  describe('components', () => {
    const getLength = component => getShallowWrapper().find(component).length

    it('renders with 1 <Grid /> component', () => {
      expect(getLength(Grid)).toBe(1)
    })

    it('renders with 1 <Card /> component', () => {
      expect(getLength(Card)).toBe(1)
    })

    it('renders with 1 <CardHeader /> component', () => {
      expect(getLength(CardHeader)).toBe(1)
    })

    it('renders with <CardContent /> component', () => {
      expect(getLength(CardContent)).toBe(1)
    })

    it('renders with <Link /> that navigates to /assessments', () => {
      const wrapper = mount(
        <MemoryRouter>
          <ClientAssessmentHistory {...params} />
        </MemoryRouter>
      ).find(CardHeader)
      expect(wrapper.props().action.props.to).toBe('/clients/1004/assessments')
    })

    it('renders with <Button /> in the Card header', () => {
      const wrapper = mount(
        <MemoryRouter>
          <ClientAssessmentHistory {...params} />
        </MemoryRouter>
      ).find(Button)
      expect(wrapper.text()).toBe('New CANS')
    })
  })

  describe('assessment history', () => {
    describe('when 2 records', () => {
      it('renders 2 assessments', async () => {
        // given + when
        const wrapper = await prepareWrapper([{ id: 1 }, { id: 2 }])

        // then
        expect(wrapper.find(ClientAssessmentHistoryRecord).length).toBe(2)
      })
    })

    describe('when 0 records', () => {
      it('renders the empty message', async () => {
        // given + when
        const wrapper = await prepareWrapper([])

        // then
        const message = wrapper.find('#no-data').text()
        expect(message).toBe('No assessments currently exist for this child/youth.')
      })
    })

    describe('submit success message', () => {
      it('is rendered when needed', () => {
        const browserHistory = { replace: jest.fn }
        // given + when
        const history = shallow(
          <ClientAssessmentHistory
            clientId={1004}
            location={{ state: { successAssessmentId: 123 } }}
            history={browserHistory}
          />
        )

        // then
        const alert = history.find('CloseableAlert')
        expect(alert.length).toBe(1)
        expect(alert.render().text()).toBe('Success! CANS assessment has been submitted.')
      })

      it('is not rendered when no successAssessmentId', () => {
        // given + when
        const history = shallow(<ClientAssessmentHistory {...params} />)

        // then
        expect(history.find('CloseableAlert').length).toBe(0)
      })

      it('is not rendered on page reload', () => {
        // given
        const browserHistory = { entries: [{ state: { successAssessmentId: 123 } }] }
        browserHistory.replace = function(newLocation) {
          this.entries.pop()
          this.entries.push(newLocation)
        }

        // when
        const assessmentHistory1 = shallow(
          <ClientAssessmentHistory clientId={1004} location={browserHistory.entries[0]} history={browserHistory} />
        )
        expect(assessmentHistory1.find('CloseableAlert').length).toBe(1)
        const assessmentHistory2 = shallow(
          <ClientAssessmentHistory clientId={1004} location={browserHistory.entries[0]} history={browserHistory} />
        )

        // then
        expect(assessmentHistory2.find('CloseableAlert').length).toBe(0)
      })
    })
  })
})
