import React from 'react'
import { SearchContainer } from './index'
import { childInfoJson } from '../Client/Client.helper.test'
import { ClientService } from '../Client/'
import { AssessmentService } from '../Assessment/'
import { shallow, mount } from 'enzyme'
import SearchAssessmentHistory from './SearchAssessmentHistory'
// import Typography from '@material-ui/core/Typography/Typography'
import { MemoryRouter, Link } from 'react-router-dom'
import { assessment } from '../Assessment/assessment.mocks.test'

jest.useFakeTimers()

const defaultProps = {
  match: {},
  client: {},
}

const mountWithRouter = async component => mount(<MemoryRouter initialEntries={['/random']}>{component}</MemoryRouter>)

describe('<SearchContainer />', () => {
  describe('init SearchContainer', () => {
    describe('page layout', () => {
      beforeEach(() => {
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
        jest.spyOn(AssessmentService, 'fetch').mockReturnValue(Promise.resolve(assessment))
      })

      const getLength = (wrapper, component) => wrapper.find(component).length

      it('renders with 1 <SearchAssessmentHistory /> component', () => {
        const wrapper = shallow(<SearchContainer />)
        expect(getLength(wrapper, SearchAssessmentHistory)).toBe(1)
      })
    })
  })
})
