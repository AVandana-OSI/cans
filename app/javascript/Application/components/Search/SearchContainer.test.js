import React from 'react'
import { SearchContainer } from './index'
import { personsJson } from '../Client/Client.helper.test'
import { ClientService } from '../Client/'
import { shallow } from 'enzyme'
import SearchAssessmentHistory from './SearchAssessmentHistory'

describe('<SearchContainer />', () => {
  let clientServiceFetchSpy

  beforeEach(() => {
    clientServiceFetchSpy = jest.spyOn(ClientService, 'search')
  })

  async function prepareWrapper(mockedServiceResponse) {
    clientServiceFetchSpy.mockReturnValue(Promise.resolve(mockedServiceResponse))
    const wrapper = shallow(<SearchContainer />)
    return wrapper
  }

  describe('init SearchContainer', () => {
    describe('page layout', () => {
      const getLength = (wrapper, component) => wrapper.find(component).length

      it('renders with 1 <SearchAssessmentHistory /> component', () => {
        const wrapper = shallow(<SearchContainer />)
        expect(getLength(wrapper, SearchAssessmentHistory)).toBe(1)
      })
    })

    describe('client service', () => {
      it('should be called during componentDidMount', () => {
        const wrapper = prepareWrapper(personsJson)
        expect(clientServiceFetchSpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})
