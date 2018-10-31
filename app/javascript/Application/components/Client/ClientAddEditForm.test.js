import React from 'react'
import { shallow, mount } from 'enzyme'
import ClientAddEditForm from './ClientAddEditForm'
import { ClientService } from './Client.service'
import { childInfoJson } from './Client.helper.test'
import { SensitivityTypesService } from './SensitivityTypes.service'
import { CountiesService } from './Counties.service'
import UserAccountService from '../common/UserAccountService'
import { CloseableAlert } from '../common/CloseableAlert'

jest.mock('./SensitivityTypes.service')

const defaultPropsEdit = {
  match: { params: { id: 1 } },
  isNewForm: false,
}

const defaultPropsAdd = {
  match: { params: { id: undefined } },
  isNewForm: true,
}

describe('<ClientAddEditForm />', () => {
  const getWrapperAdd = () => shallow(<ClientAddEditForm {...defaultPropsAdd} />)
  const getWrapperEdit = () => shallow(<ClientAddEditForm {...defaultPropsEdit} />)
  const client = {
    cases: [{ external_id: '' }],
    county: { id: 0, name: '' },
    dob: '',
    external_id: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    person_role: 'CLIENT',
    suffix: '',
  }

  describe('When isNewForm is true', () => {
    it('validates the form inputs are false', () => {
      const wrapper = shallow(<ClientAddEditForm isNewForm={true} />)
        .find('ClientAddEditForm')
        .dive()
      expect(wrapper.state('childInfo')).toEqual(client)
      expect(wrapper.state('childInfoValidation').first_name).toEqual(false)
      expect(wrapper.state('childInfoValidation').last_name).toEqual(false)
      expect(wrapper.state('childInfoValidation').dob).toEqual(false)
      expect(wrapper.state('childInfoValidation').external_id).toEqual(false)
      expect(wrapper.state('childInfoValidation').county).toEqual(false)
      expect(wrapper.state('childInfoValidation').cases[0].external_id).toEqual(true)
      expect(wrapper.state('isSaveButtonDisabled')).toEqual(true)
    })
  })

  describe('When isNewForm is false', () => {
    it('validates the form is populated', () => {
      const wrapper = shallow(<ClientAddEditForm isNewForm={false} client={childInfoJson} />)
        .find('ClientAddEditForm')
        .dive()
      expect(wrapper.state('childInfo')).toEqual(childInfoJson)
      expect(wrapper.state('childInfoValidation').first_name).toEqual(true)
      expect(wrapper.state('childInfoValidation').last_name).toEqual(true)
      expect(wrapper.state('childInfoValidation').dob).toEqual(true)
      expect(wrapper.state('childInfoValidation').external_id).toEqual(true)
      expect(wrapper.state('childInfoValidation').county).toEqual(true)
      expect(wrapper.state('childInfoValidation').cases[0].external_id).toEqual(true)
      expect(wrapper.state('isSaveButtonDisabled')).toEqual(false)
    })

    it('#handleSubmit() updates and set shouldRedirect to true', async () => {
      const clientServicePutSpy = jest.spyOn(ClientService, 'updateClient')
      const wrapper = getWrapperEdit()
      const clientEditWrapper = wrapper.find('ClientAddEditForm').dive()
      clientServicePutSpy.mockReturnValue(Promise.resolve(defaultPropsEdit.match.params.id, childInfoJson))
      await clientEditWrapper.instance().handleSubmit()
      expect(clientEditWrapper.state('redirection').shouldRedirect).toBe(true)
      clientServicePutSpy.mockClear()
    })
  })

  describe('When Editing inputs:', () => {
    it('validates first_name', () => {
      const wrapper = getWrapperEdit()
      const clientEditWrapper = wrapper.find('ClientAddEditForm').dive()
      clientEditWrapper.instance().handleChange('first_name')({
        target: { value: 'John' },
      })
    })

    it('validates last_name', () => {
      const wrapper = getWrapperEdit()
      const clientEditWrapper = wrapper.find('ClientAddEditForm').dive()
      clientEditWrapper.instance().handleChange('last_name')({
        target: { value: 'John' },
      })
      expect(clientEditWrapper.state('childInfoValidation').last_name).toEqual(true)
      expect(clientEditWrapper.state('isSaveButtonDisabled')).toEqual(false)
    })

    it('validates dob', () => {
      const wrapper = getWrapperEdit()
      const clientEditWrapper = wrapper.find('ClientAddEditForm').dive()
      clientEditWrapper.instance().handleChange('dob')({
        target: { value: '2012/10/12' },
      })
      expect(clientEditWrapper.state('childInfoValidation').dob).toEqual(true)
      expect(clientEditWrapper.state('isSaveButtonDisabled')).toEqual(false)
    })

    it('validates county', () => {
      const wrapper = getWrapperEdit()
      const clientEditWrapper = wrapper.find('ClientAddEditForm').dive()
      clientEditWrapper.instance().handleChange('county')({
        target: { value: { id: '1' } },
      })
      expect(clientEditWrapper.state('childInfoValidation').county).toEqual(true)
      expect(clientEditWrapper.state('isSaveButtonDisabled')).toEqual(false)
    })

    it('validates cases', () => {
      const wrapper = getWrapperEdit()
      const clientEditWrapper = wrapper.find('ClientAddEditForm').dive()
      clientEditWrapper.instance().handleChangeCaseNumber(0)({
        target: { value: '4321-321-4321-87654321' },
      })
      expect(clientEditWrapper.state('childInfoValidation').cases[0].external_id).toEqual(true)
      expect(clientEditWrapper.state('isSaveButtonDisabled')).toEqual(false)
    })

    it('enables Save button when all validations are good', () => {
      const wrapper = getWrapperEdit()
      const clientEditWrapper = wrapper.find('ClientAddEditForm').dive()
      const childFormInstance = clientEditWrapper.instance()
      childFormInstance.handleChange('first_name')({
        target: { value: 'John' },
      })
      childFormInstance.handleChange('last_name')({
        target: { value: 'Max' },
      })
      childFormInstance.handleChange('external_id')({
        target: { value: '1234567891234567890' },
      })
      childFormInstance.handleChange('external_id')({
        target: { value: '1234-5678-9123-4567890' },
      })
      childFormInstance.handleChange('dob')({
        target: { value: '02/08/2002' },
      })
      childFormInstance.handleChange('county')({
        target: { value: { id: '5' } },
      })
      childFormInstance.handleChangeCaseNumber(0)({
        target: { value: '4321-321-4321-87654321' },
      })
      expect(clientEditWrapper.state('isSaveButtonDisabled')).toEqual(false)
    })
  })

  describe('#handleCountyChange', () => {
    describe('when new county is different from user county', () => {
      it('sets isUserCounty to false', () => {
        jest.spyOn(SensitivityTypesService, 'fetch').mockResolvedValue([])
        const component = getWrapperEdit()
          .find('ClientAddEditForm')
          .dive()
        component.setState({ counties: [{ id: 34, name: 'Sacramento' }, { id: 49, name: 'Sonoma' }] })
        component.setState({ userCounty: { name: 'Sacramento', id: 49 } })
        component.instance().handleCountyChange({ target: { value: 'Sonoma' } })
        expect(component.state('isUsersCounty')).toEqual(false)
      })
    })

    describe('when new county is the same as user county', () => {
      it('sets isUserCounty to true', () => {
        const component = getWrapperEdit()
          .find('ClientAddEditForm')
          .dive()
        component.setState({ counties: [{ id: 34, name: 'Sacramento' }, { id: 49, name: 'Sonoma' }] })
        component.setState({ userCounty: { name: 'Sacramento', id: 49 } })
        component.instance().handleCountyChange({ target: { value: 'Sacramento' } })
        expect(component.state('isUsersCounty')).toEqual(true)
      })
    })
  })

  describe('#handleDefaultCounty', () => {
    it('once be invoked will change the childInfo.county then default county show up', () => {
      const component = getWrapperEdit()
        .find('ClientAddEditForm')
        .dive()
      component.setState({ counties: [{ id: 34, name: 'Sacramento' }, { id: 49, name: 'Sonoma' }] })
      component.setState({ userCounty: { name: 'Sacramento', id: 34 } })
      component.instance().handleDefaultCounty('Sacramento')
      expect(component.state('childInfo')).toHaveProperty('county', { id: 34, name: 'Sacramento' })
    })
  })

  describe('case numbers', () => {
    describe('#handleChangeCaseNumber()', () => {
      it('should update case external_id and validate it', () => {
        // given
        const clientForm = getWrapperAdd()
          .find('ClientAddEditForm')
          .first()
          .dive()

        // when
        clientForm.instance().handleChangeCaseNumber(0)({ target: { value: '4321-321-4321-87654321' } })

        // then
        expect(clientForm.state().childInfo.cases[0].external_id).toEqual('4321-321-4321-87654321')
        expect(clientForm.state().childInfoValidation.cases[0].external_id).toBeTruthy()
      })

      it('should validate duplicated case numbers', () => {
        // given
        const clientForm = getWrapperAdd()
          .find('ClientAddEditForm')
          .first()
          .dive()
        const clientFormInstance = clientForm.instance()
        clientFormInstance.handleAddCaseNumber({ type: 'click' })

        // when
        clientFormInstance.handleChangeCaseNumber(0)({ target: { value: '4321-321-4321-87654321' } })
        expect(clientForm.state().childInfoValidation.cases[0].external_id).toBeTruthy()
        clientFormInstance.handleChangeCaseNumber(1)({ target: { value: '4321-321-4321-87654321' } })

        // then
        clientForm.update()
        expect(clientForm.state().childInfoValidation.cases[0].external_id).toBeFalsy()
        expect(clientForm.state().childInfoValidation.cases[1].external_id).toBeFalsy()
      })
    })

    describe('initialization', () => {
      it('should initialize validation object with cases', () => {
        // given
        const inputClient = { ...client, cases: [{}, {}, {}] }

        // when
        const clientForm = shallow(<ClientAddEditForm client={inputClient} isNewForm={false} />)
          .find('ClientAddEditForm')
          .first()
          .dive()

        // then
        expect(clientForm.find('.case-numbers>InputElement').length).toEqual(3)
        const expectedCasesValidation = clientForm.state().childInfoValidation.cases
        expect(expectedCasesValidation.length).toEqual(3)
        expect(expectedCasesValidation[0]).toEqual({ external_id: true })
        expect(expectedCasesValidation[1]).toEqual({ external_id: true })
        expect(expectedCasesValidation[2]).toEqual({ external_id: true })
      })

      it('should add an initial case if child has no cases', () => {
        // given
        const clientForm = getWrapperAdd()
          .find('ClientAddEditForm')
          .first()
          .dive()

        // when
        clientForm.instance().fetchCounties()
        clientForm.update()

        // then
        expect(clientForm.find('.case-numbers>InputElement').length).toEqual(1)
        const expectedCasesValidation = clientForm.state().childInfoValidation.cases
        expect(expectedCasesValidation.length).toEqual(1)
        expect(expectedCasesValidation[0]).toEqual({ external_id: true })
      })
    })

    describe('#handleAddCaseNumber()', () => {
      it('should add new empty case number and update validation object with it', () => {
        // given
        const clientForm = getWrapperAdd()
          .find('ClientAddEditForm')
          .first()
          .dive()

        // when
        clientForm.instance().handleAddCaseNumber({ type: 'click' })
        clientForm.update()

        // then
        expect(clientForm.find('.case-numbers>InputElement').length).toEqual(2)
        const expectedCases = clientForm.state().childInfo.cases
        expect(expectedCases.length).toEqual(2)
        expect(expectedCases[1]).toEqual({ external_id: '' })
        const expectedCasesValidation = clientForm.state().childInfoValidation.cases
        expect(expectedCasesValidation.length).toEqual(2)
        expect(expectedCasesValidation[1]).toEqual({ external_id: true })
      })
    })

    describe('#prepareChildForSubmit()', () => {
      it('should remove all cases with no external_id', () => {
        // given
        const inputChildInfo = {
          cases: [{}, { external_id: '0' }, {}, { any: 'thing' }, { external_id: '1' }, {}],
        }
        const expectedChildInfo = {
          cases: [{ external_id: '0' }, { external_id: '1' }],
        }

        // when
        const actualChildInfo = getWrapperAdd()
          .find('ClientAddEditForm')
          .first()
          .dive()
          .instance()
          .prepareChildForSubmit(inputChildInfo)

        // then
        expect(actualChildInfo).toEqual(expectedChildInfo)
      })
    })
  })

  describe('#componentDidMount', () => {
    const flushPromises = () => {
      return new Promise(resolve => setImmediate(resolve))
    }

    it('fetches counties', async () => {
      const countiesService = jest.spyOn(CountiesService, 'fetchCounties').mockResolvedValue([])
      jest.spyOn(UserAccountService, 'fetchCurrent').mockResolvedValue({})
      mount(<ClientAddEditForm {...defaultPropsAdd} />)
      await flushPromises()
      expect(countiesService).toHaveBeenCalledWith()
    })

    it('fetches userAccount', async () => {
      jest.spyOn(CountiesService, 'fetchCounties').mockResolvedValue([])
      const userAccountService = jest.spyOn(UserAccountService, 'fetchCurrent').mockResolvedValue({})
      mount(<ClientAddEditForm {...defaultPropsAdd} />)
      await flushPromises()
      expect(userAccountService).toHaveBeenCalledWith()
    })
  })

  it('#handleSubmit()', async () => {
    const clientServicePutSpy = jest.spyOn(ClientService, 'updateClient')
    const wrapper = getWrapperEdit()
    const clientEditWrapper = wrapper.find('ClientAddEditForm').dive()
    clientServicePutSpy.mockReturnValue(Promise.resolve(childInfoJson))
    await clientEditWrapper.instance().handleSubmit()
    expect(clientEditWrapper.state().redirection.shouldRedirect).toBe(true)
    clientServicePutSpy.mockClear()
  })

  it('#handleCancel()', () => {
    const wrapper = getWrapperEdit()
    const clientEditWrapper = wrapper.find('ClientAddEditForm').dive()
    clientEditWrapper.instance().handleCancel()
    expect(clientEditWrapper.state('redirection').shouldRedirect).toBe(true)
  })

  it('renders counties drop down', () => {
    const wrapper = getWrapperEdit()
    const clientEditWrapper = wrapper.find('ClientAddEditForm').dive()
    const childFormInstance = clientEditWrapper.instance()
    childFormInstance.fetchCounties()
    clientEditWrapper.update()
    const menuItems = clientEditWrapper.find('MenuItem')
    expect(menuItems.children.length).toEqual(1)
  })

  describe('SensitivityType dropdown', () => {
    const fetchSpy = jest.spyOn(SensitivityTypesService, 'fetch')
    describe('when no county selected', () => {
      it('does not render sensitivityType drop down', () => {
        fetchSpy.mockClear()
        const wrapper = getWrapperAdd()
        const clientEditWrapper = wrapper.find('ClientAddEditForm').dive()
        expect(fetchSpy).toHaveBeenCalledTimes(0)
        expect(clientEditWrapper.find('#sensitivity_type_dropdown').length).toEqual(0)
      })
    })

    describe('when county selected', () => {
      const clientEditWrapper = getWrapperAdd()
        .find('ClientAddEditForm')
        .first()
        .dive()
      describe('when no sensitivity types', () => {
        it('does not render sensitivity_type drop down', async () => {
          SensitivityTypesService.fetch.mockClear()
          SensitivityTypesService.fetch.mockReturnValue(Promise.resolve([]))
          const childFormInstance = clientEditWrapper.instance()
          childFormInstance.setState({ counties: [{ id: 1, name: 'county' }] })
          childFormInstance.handleCountyChange({ target: { value: 'county' } })
          await clientEditWrapper.update()
          expect(fetchSpy).toHaveBeenCalledTimes(1)
          expect(clientEditWrapper.find('#sensitivity_type_dropdown').length).toEqual(0)
        })

        it('should reset sensitivity type to initial value', async () => {
          const sensitivityTypeInitial = 'initial_value'
          const clientForm = shallow(
            <ClientAddEditForm
              {...defaultPropsAdd}
              client={{
                sensitivity_type: sensitivityTypeInitial,
                cases: [],
                county: { id: 1, name: 'county' },
              }}
              isNewForm={false}
            />
          )
            .find('ClientAddEditForm')
            .first()
            .dive()

          const clientFormInstance = clientForm.instance()
          clientFormInstance.setState({ counties: [{ id: 1, name: 'county' }] })
          clientFormInstance.setState({ sensitivityTypes: ['TYPE', 'TYPE1'] })
          await clientForm.update()
          expect(clientForm.state().initialSensitivityType).toEqual(sensitivityTypeInitial)
          expect(clientForm.state().childInfo.sensitivity_type).toEqual(sensitivityTypeInitial)

          SensitivityTypesService.fetch.mockClear()
          SensitivityTypesService.fetch.mockReturnValue(Promise.resolve(['TYPE', 'TYPE1']))
          clientFormInstance.handleCountyChange({ target: { value: 'county' } })
          clientFormInstance.handleSensitivityTypeChange({ target: { value: 'TYPE' } })
          await clientForm.update()
          expect(clientForm.state().childInfo.sensitivity_type).toEqual('TYPE')

          SensitivityTypesService.fetch.mockClear()
          SensitivityTypesService.fetch.mockReturnValue(Promise.resolve([]))
          clientFormInstance.handleCountyChange({ target: { value: '' } })
          await clientForm.update()
          expect(clientForm.state().childInfo.sensitivity_type).toEqual(sensitivityTypeInitial)
        })
      })

      describe('when list of sensitivity types', () => {
        it('renders sensitivity_type dropdown and options', async () => {
          SensitivityTypesService.fetch.mockClear()
          SensitivityTypesService.fetch.mockReturnValue(Promise.resolve(['TYPE', 'TYPE1']))
          const childFormInstance = clientEditWrapper.instance()
          childFormInstance.setState({ counties: [{ id: 1, name: 'county' }] })
          childFormInstance.handleCountyChange({ target: { value: 'county' } })
          await clientEditWrapper.update()
          expect(fetchSpy).toHaveBeenCalledTimes(1)
          expect(clientEditWrapper.find('#sensitivity_type_dropdown').length).toEqual(1)
          expect(clientEditWrapper.find('.sensitivity_type_option').length).toEqual(2)
        })
      })
    })

    describe('when sensitivityType changed', () => {
      const clientEditWrapper = getWrapperAdd()
        .find('ClientAddEditForm')
        .first()
        .dive()
      it('should set sensityvity_type to childInfo', () => {
        const childFormInstance = clientEditWrapper.instance()
        childFormInstance.setState({ sensitivityTypes: ['TYPE'] })
        childFormInstance.handleSensitivityTypeChange({ target: { value: 'TYPE' } })
        clientEditWrapper.update()
        expect(childFormInstance.state.childInfo.sensitivity_type).toEqual('TYPE')
      })
    })
  })

  describe('#fetchUserAccount', () => {
    describe('when successful', () => {
      it('sets userCounty', async () => {
        jest.spyOn(UserAccountService, 'fetchCurrent').mockResolvedValue({ county_code: '49', county_name: 'Sonoma' })
        const component = getWrapperAdd()
          .find('ClientAddEditForm')
          .dive()
        await component.instance().fetchUserAccount()
        expect(component.state('userCounty')).toEqual({ id: 49, name: 'Sonoma' })
      })
    })

    describe('when unsuccessful', () => {
      it('does not change userCounty', async () => {
        jest.spyOn(UserAccountService, 'fetchCurrent').mockRejectedValue(new Error('Async Error'))
        const component = getWrapperAdd()
          .find('ClientAddEditForm')
          .dive()
        await component.instance().fetchUserAccount()
        expect(component.state('userCounty')).toEqual({ id: 0, name: '' })
      })
    })
  })

  describe('#redirectPath', () => {
    let component

    beforeEach(() => {
      component = getWrapperAdd()
        .find('ClientAddEditForm')
        .dive()
    })

    describe('when user county is the same', () => {
      beforeEach(() => {
        component.setState({ isUsersCounty: true })
      })

      describe('with new form', () => {
        describe('when submitting', () => {
          beforeEach(() => {
            component.setState({ redirection: { successClientId: 1 } })
          })

          it('redirects to client detail', () => {
            expect(component.instance().redirectPath(1)).toBe('/clients/1')
          })
        })

        describe('when canceling', () => {
          it('redirects to client listing', () => {
            expect(component.instance().redirectPath(undefined)).toBe('/clients')
          })
        })
      })

      describe('with existing form', () => {
        describe('when submitting', () => {
          beforeEach(() => {
            component.setState({ redirection: { successClientId: 1 } })
          })

          it('redirects to client detail', () => {
            expect(component.instance().redirectPath(1)).toBe('/clients/1')
          })
        })

        describe('when canceling', () => {
          it('redirects to client listing', () => {
            expect(component.instance().redirectPath(1)).toBe('/clients/1')
          })
        })
      })
    })

    describe('when user county differs', () => {
      beforeEach(() => {
        component.setState({ isUsersCounty: false })
      })

      describe('with new form', () => {
        describe('when submitting', () => {
          beforeEach(() => {
            component.setState({ redirection: { successClientId: 1 } })
          })

          it('redirects to client listing', () => {
            expect(component.instance().redirectPath(1)).toBe('/clients')
          })
        })

        describe('when canceling', () => {
          it('redirects to client listing', () => {
            expect(component.instance().redirectPath(undefined)).toBe('/clients')
          })
        })
      })

      describe('with existing form', () => {
        describe('when submitting', () => {
          beforeEach(() => {
            component.setState({ redirection: { successClientId: 1 } })
          })

          it('redirects to client listing', () => {
            expect(component.instance().redirectPath(1)).toBe('/clients')
          })
        })

        describe('when canceling', () => {
          it('redirects to client detail', () => {
            expect(component.instance().redirectPath(1)).toBe('/clients/1')
          })
        })
      })
    })
  })

  describe('#renderFormFooter', () => {
    describe('with isUsersCounty true', () => {
      it('renders a warning message', () => {
        const component = getWrapperAdd()
          .find('ClientAddEditForm')
          .dive()
        component.setState({ isUsersCounty: true })
        expect(
          component
            .find(CloseableAlert)
            .findWhere(alert => alert.props().message.match(/The Child's County does not match the User's County/))
            .length
        ).toBe(0)
      })
    })

    describe('with isUsersCounty false', () => {
      it('renders a warning message', () => {
        const component = getWrapperAdd()
          .find('ClientAddEditForm')
          .dive()
        component.setState({ isUsersCounty: false })
        expect(
          component
            .find(CloseableAlert)
            .findWhere(alert => alert.props().message.match(/The Child's County does not match the User's County/))
            .length
        ).toBe(1)
      })
    })
  })

  describe('#renderNameInputs', () => {
    const wrapper = getWrapperAdd()
    const clientEditWrapper = wrapper.find('ClientAddEditForm').dive()
    describe.each`
      input             | isRequired
      ${'#first_name'}  | ${true}
      ${'#middle_name'} | ${false}
      ${'#last_name'}   | ${true}
      ${'#suffix'}      | ${false}
    `('$input', ({ input, isRequired }) => {
      test(`renders input with required: ${isRequired}`, () => {
        expect(clientEditWrapper.find(input).prop('required')).toBe(isRequired)
      })
    })
  })

  describe('when error', () => {
    it('renders a error message', () => {
      const component = getWrapperAdd()
        .find('ClientAddEditForm')
        .dive()
      component.setState({ error: { message: 'Error Message' } })
      expect(
        component.find(CloseableAlert).findWhere(alert => alert.props().message.match(/Error Message/)).length
      ).toBe(1)
    })
  })

  describe('#handleError', () => {
    describe('when 409 error', () => {
      const error = {
        response: {
          status: 409,
          data: {
            issue_details: [
              {
                technical_message: 'duplicate entity',
              },
              {
                technical_message: 'other error',
              },
            ],
          },
        },
      }

      it('sets error to state', async () => {
        const clientServiceSpy = jest.spyOn(ClientService, 'updateClient')
        const component = getWrapperEdit()
          .find('ClientAddEditForm')
          .dive()
        clientServiceSpy.mockRejectedValue(error)
        await component.instance().handleSubmit({ preventDefault: jest.fn() })
        await component.update()
        expect(component.state().error).toEqual({ message: 'duplicate entity' })
      })

      it('sets error to state when adding new client', async () => {
        const clientServiceSpy = jest.spyOn(ClientService, 'addClient')
        const component = getWrapperAdd()
          .find('ClientAddEditForm')
          .dive()
        clientServiceSpy.mockRejectedValue(error)
        await component.instance().handleSubmit({ preventDefault: jest.fn() })
        await component.update()
        expect(component.state().error).toEqual({ message: 'duplicate entity' })
      })
    })
  })
})
