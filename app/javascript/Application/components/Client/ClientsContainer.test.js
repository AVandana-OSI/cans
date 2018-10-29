import React from 'react'
import { shallow } from 'enzyme'
import ClientsContainer from './ClientsContainer'
import { LoadingState } from '../../util/loadingHelper'
import ClientSocialWorkerCard from './ClientSocialWorkerCard'
import ClientService from './Client.service'
import UserAccountService from '../common/UserAccountService'
import { handleError } from '../../util/ApiErrorHandler'

jest.mock('./Client.service')
jest.mock('../common/UserAccountService')
jest.mock('../../util/ApiErrorHandler')

describe('<ClientsContainer />', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<ClientsContainer />, { disableLifecycleMethods: true })
  })

  it('initial State has waiting LoadingState and no records', () => {
    expect(wrapper.instance().state.dataStatus).toBe(LoadingState.waiting)
    expect(wrapper.instance().state.records).toEqual([])
  })

  it('will load client list, get records amount and loadingState change to ready when Component mounted with correct fetching', async () => {
    const userAccountFetchSpy = jest.spyOn(UserAccountService, 'fetchCurrent')
    const sWClientsFetchSpy = jest.spyOn(ClientService, 'socialWorkerClient')
    userAccountFetchSpy.mockReturnValue({ staff_id: 5 })
    sWClientsFetchSpy.mockReturnValue([1, 2, 3])
    await wrapper.instance().componentDidMount()
    expect(wrapper.instance().state).toEqual({ dataStatus: 'READY', records: [1, 2, 3], recordsAmount: 3 })
  })

  it('will render ClientSocialWorkerCard', async () => {
    expect(wrapper.find(ClientSocialWorkerCard).exists()).toBe(true)
  })
})

describe('ClientRecordsChk works well', () => {
  let wrapper
  let checker
  let target
  beforeEach(() => {
    wrapper = shallow(<ClientsContainer />, { disableLifecycleMethods: true })
    checker = wrapper.instance().ClientRecordsChk
    target = handleError.mockReturnValue(true)
  })

  afterEach(() => {
    handleError.mockClear()
  })

  it('global alert will be triggered with records which is not an array', async () => {
    checker(null)
    checker({ key: 'value' })
    checker(undefined)
    checker('string')
    checker(100)
    checker('')
    expect(target).toHaveBeenCalledTimes(6)
  })

  it('global alert will NOT be triggered when there is no record', async () => {
    checker([])
    expect(target).toHaveBeenCalledTimes(0)
  })
})
