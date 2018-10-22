import React from 'react'
import { shallow } from 'enzyme'
import ClientsContainer from './ClientsContainer'
import ClientService from './Client.service'
import { personsJson } from './Client.helper.test'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { LoadingState } from '../../util/loadingHelper'

const searchPeopleResponse = {
  records: personsJson,
  total_records: 4,
}

const emptyResponse = {
  records: [],
  total_records: 0,
}

describe('<ClientsContainer />', () => {
  let clientServiceFetchSpy

  beforeEach(() => {
    clientServiceFetchSpy = jest.spyOn(ClientService, 'search')
  })

  async function shallowClientsContainer(mockedServiceResponse) {
    clientServiceFetchSpy.mockReturnValue(Promise.resolve(mockedServiceResponse))
    const clientsContainer = await shallow(<ClientsContainer />)
    return clientsContainer
  }

  async function shallowReactTable(mockedServiceResponse) {
    const clientsContainer = await shallowClientsContainer(mockedServiceResponse)
    return clientsContainer.find('ReactTable').dive()
  }

  describe('rendering', () => {
    it('renders a card with a header', async () => {
      const clientsContainer = await shallowClientsContainer(searchPeopleResponse)
      expect(clientsContainer.find(Card).length).toBe(1)
      expect(clientsContainer.find(CardHeader).props().title).toBe('County Client List')
    })

    it('renders a Search filters block', async () => {
      const clientsContainer = await shallowClientsContainer(searchPeopleResponse)
      expect(clientsContainer.find('Label').length).toBe(4)
      expect(clientsContainer.find('Input').length).toBe(3)
      expect(clientsContainer.find('DateField').length).toBe(1)
      expect(clientsContainer.find('Button').length).toBe(2)

      expect(clientsContainer.find('Input#firstName-input').length).toBe(1)
      expect(clientsContainer.find('Input#middleName-input').length).toBe(1)
      expect(clientsContainer.find('Input#lastName-input').length).toBe(1)
      expect(clientsContainer.find('DateField#dob-input').length).toBe(1)
      expect(clientsContainer.find('Button#search-button').length).toBe(1)
      expect(clientsContainer.find('Button#reset-filter').length).toBe(1)
    })

    it('renders a Search result block', async () => {
      const reactTable = await shallowReactTable(searchPeopleResponse)
      expect(reactTable.find('.pagination-top').length).toBe(1)
      const headerTitles = reactTable.find('.rt-resizable-header-content').map(header => header.text())
      expect(headerTitles).toEqual(['Full Name', 'Date of Birth', 'Access Restrictions'])
      expect(reactTable.find('Tbody>TrGroupComponent>TrComponent').length).toBe(3)
      expect(reactTable.find('.pagination-bottom').length).toBe(1)
    })

    it('should not fail when could not fetch data', async () => {
      const promise = Promise.reject(new Error('e'))
      clientServiceFetchSpy.mockReturnValue(promise)
      const container = await shallow(<ClientsContainer />)
      return promise.catch(() => {
        expect(container.instance().state.clientsStatus).toEqual(LoadingState.error)
      })
    })
  })

  describe('when client list is empty', () => {
    it('renders "No records found" message', async () => {
      const reactTable = await shallowReactTable(emptyResponse)
      expect(
        reactTable
          .find('NoData')
          .dive()
          .text()
      ).toBe('No records found')
    })
  })

  describe('when client list has 3 clients ', () => {
    const assertElementText = (element, expectedText) => expect(element.dive().text()).toEqual(expectedText)

    const assertRecordTexts = (recordWrapper, texts) => {
      assertElementText(recordWrapper.at(0), texts[0])
      assertElementText(recordWrapper.at(1), texts[1])
      assertElementText(recordWrapper.at(2), texts[2])
    }

    it('renders sensitive and non-sensitive clients names', async () => {
      const reactTable = await shallowReactTable(searchPeopleResponse)
      const records = reactTable.find('Tbody>TrGroupComponent>TrComponent')
      assertRecordTexts(records.at(0).find('TdComponent'), ['wayne, Bruce Middle, Mr.', '01/28/2014', 'Sensitive'])
      assertRecordTexts(records.at(1).find('TdComponent'), ['Parker, Peter Middle, Mr.', '01/28/2015', 'Sensitive'])
      assertRecordTexts(records.at(2).find('TdComponent'), ['<Link />', '01/28/2016', ''])
      expect(
        records
          .at(2)
          .find('.client-name')
          .props().children
      ).toEqual('Parker, Charley Middle, Mr.')
    })
  })

  describe('filtering search results', () => {
    it('should filter by all the parameters on Search button click', async () => {
      // given
      const clientsContainer = await shallowClientsContainer(searchPeopleResponse)
      const changeValue = (selector, value) => clientsContainer.find(selector).simulate('change', { target: { value } })
      changeValue('Input#firstName-input', 'First')
      changeValue('Input#middleName-input', 'Middle')
      changeValue('Input#lastName-input', 'Last')
      clientsContainer.find('DateField#dob-input').simulate('change', '10/10/2011')

      // when
      clientsContainer.find('Button#search-button').simulate('click')

      // then
      expect(clientServiceFetchSpy.mock.calls.length).toBe(2)
      expect(clientServiceFetchSpy.mock.calls[1][0]).toEqual({
        firstName: 'First',
        middleName: 'Middle',
        lastName: 'Last',
        dob: '10/10/2011',
        pagination: { page: 0, pageSize: 10, pages: 1 },
      })
    })

    it('should reset all filters on Reset button click', async () => {
      // given
      const clientsContainer = await shallowClientsContainer(searchPeopleResponse)
      const changeValue = (selector, value) => clientsContainer.find(selector).simulate('change', { target: { value } })
      changeValue('Input#firstName-input', 'First')
      changeValue('Input#middleName-input', 'Middle')
      changeValue('Input#lastName-input', 'Last')
      clientsContainer.find('DateField#dob-input').simulate('change', '10/10/2011')

      // when
      clientsContainer.find('Button#reset-filter').simulate('click')

      // then
      const assertValue = (selector, value) => expect(clientsContainer.find(selector).props().value).toEqual(value)
      assertValue('Input#firstName-input', '')
      assertValue('Input#middleName-input', '')
      assertValue('Input#lastName-input', '')
      assertValue('DateField#dob-input', '')
    })

    describe('filter by key press on the input field', () => {
      describe('when the Enter key is pressed', () => {
        it('should invoke clients search ', async () => {
          // given
          const clientsContainer = await shallowClientsContainer(searchPeopleResponse)

          // when
          clientsContainer.instance().handleFilterInputKeyPress({ type: 'keypress', key: 'Enter' })

          // then
          expect(clientServiceFetchSpy.mock.calls.length).toBe(2)
        })
      })

      describe('when any key except Enter key is pressed', () => {
        it('should not invoke clients search ', async () => {
          // given
          const clientsContainer = await shallowClientsContainer(searchPeopleResponse)

          // when
          clientsContainer.instance().handleFilterInputKeyPress({ type: 'keypress', key: 'A' })

          // then
          expect(clientServiceFetchSpy.mock.calls.length).toBe(1)
        })
      })
    })
  })

  describe('pagination', () => {
    it('should invoke clients search on the pagination page change', async () => {
      // given
      const clientsContainer = await shallowClientsContainer(searchPeopleResponse)
      const pageNumber = 2

      // when
      await clientsContainer.instance().handleOnPageChange(pageNumber)

      // then
      expect(clientServiceFetchSpy.mock.calls.length).toBe(2)
      expect(clientServiceFetchSpy.mock.calls[1][0].pagination.page).toEqual(pageNumber)
    })

    it('should invoke clients search on the pagination page size change', async () => {
      // given
      const clientsContainer = await shallowClientsContainer(searchPeopleResponse)
      const pageSize = 5

      // when
      await clientsContainer.instance().handleOnPageSizeChange(pageSize)

      // then
      expect(clientServiceFetchSpy.mock.calls.length).toBe(2)
      expect(clientServiceFetchSpy.mock.calls[1][0].pagination.pageSize).toEqual(pageSize)
    })
  })
})
