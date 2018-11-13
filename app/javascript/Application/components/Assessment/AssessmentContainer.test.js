import React from 'react'
import { AssessmentContainer, AssessmentFormHeader, AssessmentService, SecurityService } from './index'
import { childInfoJson } from '../Client/Client.helper.test'
import ClientService from '../Client/Client.service'
import { shallow, mount } from 'enzyme'
import { PageInfo } from '../Layout'
import Typography from '@material-ui/core/Typography/Typography'
import AssessmentFormFooter from './AssessmentFormFooter'
import { MemoryRouter, Link } from 'react-router-dom'
import PageModal from '../common/PageModal'
import {
  assessment,
  updatedAssessment,
  initialAssessment,
  instrument,
  updatedAssessmentDomains,
  updatedAssessmentWithDomains,
} from './assessment.mocks.test'
import { LoadingState } from '../../util/loadingHelper'
import { CloseableAlert } from '../common/CloseableAlert'
import { getCurrentIsoDate } from '../../util/dateHelper'
import { Print } from '../Print'

jest.useFakeTimers()

const defaultProps = {
  location: { childId: 1 },
  match: { params: { id: 1 } },
  isNewForm: false,
  client: childInfoJson,
}

const mountWithRouter = async component => mount(<MemoryRouter initialEntries={['/random']}>{component}</MemoryRouter>)

describe('<AssessmentContainer />', () => {
  describe('init AssessmentContainer', () => {
    describe('page layout', () => {
      const props = {
        location: { childId: 10 },
        match: { params: { id: 1 } },
        isNewForm: false,
        client: {},
      }

      beforeEach(() => {
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
        jest.spyOn(SecurityService, 'checkPermission').mockReturnValue(Promise.resolve(true))
        jest.spyOn(AssessmentService, 'fetch').mockReturnValue(Promise.resolve(assessment))
      })

      const getLength = (wrapper, component) => wrapper.find(component).length

      it('renders with 1 <PageInfo /> component', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        expect(getLength(wrapper, PageInfo)).toBe(1)
      })

      it('renders with 1 <AssessmentFormHeader /> component', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        expect(getLength(wrapper, AssessmentFormHeader)).toBe(1)
      })

      it('renders with 1 <Typography /> component', async () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        await wrapper.instance().componentDidMount()
        expect(getLength(wrapper, Typography)).toBe(1)
      })

      it('renders with 1 <AssessmentFormFooter /> component', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        expect(getLength(wrapper, AssessmentFormFooter)).toBe(1)
      })
    })

    describe('page title', () => {
      it('should be "New CANS" for new assessment', () => {
        const wrapper = shallow(<AssessmentContainer isNewForm={true} client={{}} />)
        const pageInfoText = wrapper
          .find('PageInfo')
          .render()
          .text()
        expect(pageInfoText).toMatch(/New CANS/)
        expect(pageInfoText).toMatch(/Print/)
      })

      it('should be "CANS Assessment Form" for the existent assessment', () => {
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        const pageInfoText = wrapper
          .find('PageInfo')
          .render()
          .text()
        expect(pageInfoText).toMatch(/CANS Assessment Form/)
        expect(pageInfoText).toMatch(/Print/)
      })
    })

    describe('print assessment', () => {
      it('should render <Print /> on print button click', () => {
        // given
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        expect(wrapper.find(Print).length).toBe(0)

        // when
        wrapper
          .find('PageInfo')
          .dive()
          .find('.print-link')
          .simulate('click')
        wrapper.update()

        // then
        expect(wrapper.find(Print).length).toBe(1)
      })
    })

    describe('print through keyboard', () => {
      it('should add and remove event handler', () => {
        const adder = jest.spyOn(global, 'addEventListener').mockImplementation(() => {})
        const remover = jest.spyOn(global, 'removeEventListener').mockImplementation(() => {})
        const wrapper = shallow(<AssessmentContainer isNewForm={false} client={{}} />)
        expect(adder).toHaveBeenCalledTimes(1)
        wrapper.unmount()
        expect(remover).toHaveBeenCalledTimes(1)
      })

      it('when a user press ctrl+p', () => {
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        wrapper.instance().handleCtrlP({
          ctrlKey: true,
          key: 'p',
          preventDefault: () => {},
        })
        expect(wrapper.find(Print).length).toBe(1)
      })

      it('when a user press meta+p', () => {
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        wrapper.instance().handleCtrlP({
          metaKey: true,
          key: 'p',
          preventDefault: () => {},
        })
        expect(wrapper.find(Print).length).toBe(1)
      })
    })

    describe('renders component and shows warning', () => {
      const props = { ...defaultProps }
      it('updates state when user clicks I agree and removes warning', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
          isSubmitWarningShown: true,
        })
        wrapper
          .find('ConfidentialityWarning')
          .props()
          .onRemove()
        wrapper.instance().handleSubmitWarning(false)
        expect(wrapper.state().isSubmitWarningShown).toEqual(false)
      })

      it('verify warning is not shown when isSubmitWarningShown is falsy', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
          isSubmitWarningShown: false,
        })
        expect(wrapper.find('ConfidentialityWarning').exists()).toEqual(false)
      })
    })

    describe('renders a component which shows warning and sets the state', () => {
      const props = { ...defaultProps }
      it('verify the state is updated and removed domains ', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
          isCaregiverWarningShown: true,
          focusedCaregiverId: 0,
        })
        wrapper
          .find('PageModal')
          .props()
          .onRemove()
        wrapper.instance().handleWarningShow(false)
        expect(wrapper.state().isCaregiverWarningShown).toEqual(false)
        wrapper.instance().handleCaregiverRemove(1)
        wrapper.state().assessment.state.domains = updatedAssessmentDomains
        wrapper.instance().updateAssessment(wrapper.state().assessment)
        expect(wrapper.state().assessment).toEqual(updatedAssessmentWithDomains)
      })

      it('verify the state is updated and the modal is closed', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
          isCaregiverWarningShown: true,
          focusedCaregiverId: null,
        })
        wrapper
          .find('PageModal')
          .props()
          .onRemove()
        wrapper.instance().handleWarningShow(false)
        expect(wrapper.state().isCaregiverWarningShown).toEqual(false)
        wrapper.instance().handleCaregiverRemove(null)
        wrapper.instance().handleCaregiverRemoveAll('has_caregiver', false)
        expect(wrapper.state().assessment.has_caregiver).toEqual(false)
      })
    })

    describe('verifies if caregiver id is removed when the state is updated', () => {
      const props = { ...defaultProps }
      it('should set cargiver value to null', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
          isCaregiverWarningShown: true,
          focusedCaregiverId: 0,
        })
        wrapper.instance().handleWarningShow(false)
        expect(wrapper.state().isCaregiverWarningShown).toEqual(false)
        expect(wrapper.state().focusedCaregiverId).toEqual(null)
      })

      it('should update cargiver value in state', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
          isCaregiverWarningShown: true,
          focusedCaregiverId: 1,
        })
        wrapper.instance().handleWarningShow(false, 1)
        expect(wrapper.state().isCaregiverWarningShown).toEqual(false)
        expect(wrapper.state().focusedCaregiverId).toEqual(1)
      })
    })

    describe('warning modal when warning is canceled', () => {
      const props = { ...defaultProps }
      it('should not render PageModal component when warningShow is not true', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
          isCaregiverWarningShown: false,
        })
        expect(wrapper.find(PageModal).length).toBe(0)
      })
    })

    describe('warning model when warning is shown', () => {
      const props = { ...defaultProps }
      it('should render PageModal component when warningShow is true', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
          isCaregiverWarningShown: true,
        })
        expect(wrapper.find(PageModal).length).toBe(1)
      })

      it('should render cancel button label when warningShow is true', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
          isCaregiverWarningShown: true,
        })
        expect(wrapper.find(PageModal).props().cancelButtonLabel).toContain('Cancel')
      })

      it('should render remove button label when warningShow is true', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
          isCaregiverWarningShown: true,
        })
        expect(wrapper.find(PageModal).props().removeButtonLabel).toContain('Remove')
      })

      it('should render description when warningShow is true', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
          isCaregiverWarningShown: true,
        })
        expect(wrapper.find(PageModal).props().description).toContain('This may effect some of your entries.')
      })

      it('should render title when warningShow is true', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
          isCaregiverWarningShown: true,
        })
        expect(wrapper.find(PageModal).props().title).toContain('Warning')
      })

      it('should render isOpen when warningShow is true', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().setState({
          assessment: assessment,
          isCaregiverWarningShown: true,
        })
        expect(wrapper.find(PageModal).props().isOpen).toEqual(true)
      })
    })

    describe('warning message on absence of edit permission', () => {
      it('should render warning message', async () => {
        const props = {
          location: { childId: 1 },
          match: { params: { id: 1 } },
          isNewForm: false,
          client: {},
        }
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
        jest.spyOn(SecurityService, 'checkPermission').mockReturnValue(Promise.resolve(false))
        jest.spyOn(AssessmentService, 'fetch').mockReturnValue(Promise.resolve(assessment))
        const wrapper = await shallow(<AssessmentContainer {...props} />)
        await wrapper.instance().componentDidMount()
        expect(wrapper.find(CloseableAlert).length).toBe(1)
        const warning = wrapper.find(CloseableAlert).first()
        expect(warning.props().message).toBe(
          'This assessment was initiated in a county that is different than the User’s ' +
            'County. Saving and Submitting are disabled'
        )
        expect(wrapper.find(Typography).length).toBe(0)
      })

      it('should not render warning message', async () => {
        const props = {
          location: { childId: 10 },
          match: { params: { id: '123' } },
          isNewForm: false,
          client: {},
        }
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
        jest.spyOn(SecurityService, 'checkPermission').mockReturnValue(Promise.resolve(true))
        jest.spyOn(AssessmentService, 'fetchNewAssessment').mockReturnValue(Promise.resolve(assessment))
        const wrapper = await shallow(<AssessmentContainer {...props} />)
        await wrapper.instance().componentDidMount()
        expect(wrapper.find(CloseableAlert).length).toBe(0)
      })

      it('should not render warning message when assessment is new', async () => {
        const props = {
          location: { childId: 10 },
          isNewForm: false,
          client: {},
        }
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
        jest.spyOn(AssessmentService, 'fetchNewAssessment').mockReturnValue(Promise.resolve(assessment))
        const wrapper = await shallow(<AssessmentContainer {...props} />)
        await wrapper.instance().componentDidMount()
        expect(wrapper.find(CloseableAlert).length).toBe(0)
      })
    })

    describe('assessment form with no existing assessment', () => {
      const props = {
        client: childInfoJson,
        isNewForm: false,
      }

      it('calls fetchNewAssessment', async () => {
        const assessmentServiceGetSpy = jest.spyOn(AssessmentService, 'fetchNewAssessment')
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
        jest.spyOn(SecurityService, 'checkPermission').mockReturnValue(Promise.resolve(true))
        const wrapper = shallow(<AssessmentContainer {...props} />)
        await wrapper.instance().componentDidMount()
        expect(assessmentServiceGetSpy).toHaveBeenCalledWith()
      })

      it('sets a new assessment on component state', () => {
        const wrapper = shallow(<AssessmentContainer {...props} />)
        expect(wrapper.state('assessment').instrument_id).toBeFalsy()
        wrapper.instance().onFetchNewAssessmentSuccess(instrument)
        const assessment = wrapper.state('assessment')
        expect(assessment).toEqual({
          ...initialAssessment,
          case_or_referral_id: 'C6vN5DG0Aq',
          case_or_referral_uiid: '0687-9473-7673-8000672',
        })
        expect(assessment.person).toEqual(childInfoJson)
        expect(assessment.county).toEqual(childInfoJson.county)
      })
    })

    describe('assessment form with an existing assessment', () => {
      it('calls fetchAssessment', async () => {
        const props = {
          location: { childId: 1 },
          isNewForm: false,
          isSaveButtonEnabled: true,
          client: {},
        }
        const assessmentServiceGetSpy = jest.spyOn(AssessmentService, 'fetchNewAssessment')
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
        jest.spyOn(SecurityService, 'checkPermission').mockReturnValue(Promise.resolve(true))
        const wrapper = shallow(<AssessmentContainer {...props} />)
        await wrapper.instance().componentDidMount()
        expect(assessmentServiceGetSpy).toHaveBeenCalledWith()
      })
    })
  })

  describe('save assessment', () => {
    describe('with a new assessment', () => {
      it('should call AssessmentService.postAssessment', () => {
        const assessmentServicePostSpy = jest.spyOn(AssessmentService, 'postAssessment')
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        const assessment = {
          event_date: getCurrentIsoDate(),
          has_caregiver: true,
          person: childInfoJson,
          state: { domains: [] },
        }
        wrapper.instance().handleSaveAssessment()
        assessmentServicePostSpy.mockReturnValue(Promise.resolve(assessment))
        expect(assessmentServicePostSpy).toHaveBeenCalledWith(assessment)
      })

      it('should render save success message on initial save', async () => {
        // given
        jest.spyOn(AssessmentService, 'postAssessment').mockReturnValue(Promise.resolve(assessment))
        const wrapper = await shallow(<AssessmentContainer client={childInfoJson} isNewForm={false} />)

        // when
        await wrapper.instance().handleSaveAssessment()
        wrapper.update()

        // then
        expect(wrapper.find(CloseableAlert).length).toBe(1)
      })
    })

    describe('with an existing assessment', () => {
      it('should call AssessmentService.update', () => {
        const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update')
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment))
        wrapper.setState({ assessment: { id: 1 } })
        wrapper.instance().handleSaveAssessment()
        expect(assessmentServicePutSpy).toHaveBeenCalledWith(1, { id: 1, person: childInfoJson })
      })

      it('should update state with assessment', async () => {
        const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update')
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment))
        wrapper.setState({ assessment: { id: 1 } })
        await wrapper.instance().handleSaveAssessment()
        expect(assessmentServicePutSpy).toHaveBeenCalledWith(1, { id: 1, person: childInfoJson })
        expect(wrapper.state('assessment').id).toBe(1)
        expect(wrapper.state('assessment').state.domains).toBeTruthy()
      })

      it('should render save success message on save', async () => {
        // given
        jest.spyOn(ClientService, 'fetch').mockReturnValue(Promise.resolve(childInfoJson))
        jest.spyOn(AssessmentService, 'update').mockReturnValue(Promise.resolve(assessment))
        jest.spyOn(SecurityService, 'checkPermission').mockReturnValue(Promise.resolve(true))
        jest.spyOn(AssessmentService, 'fetchNewAssessment').mockReturnValue(Promise.resolve(assessment))
        const wrapper = await shallow(<AssessmentContainer client={childInfoJson} isNewForm={false} />)
        wrapper.setState({ assessment: { id: 1 } })
        // when
        await wrapper.instance().handleSaveAssessment()
        wrapper.update()

        // then
        const alertWrapper = wrapper.find(CloseableAlert)
        expect(alertWrapper.length).toBe(1)
        const linkWrapper = alertWrapper
          .first()
          .dive()
          .find(Link)
          .first()
        expect(linkWrapper.props().to).toBe('/clients/aaaaaaaaaa')

        // when 2 (the message is auto closed)
        jest.runAllTimers()
        wrapper.update()

        // then 2
        expect(wrapper.find(CloseableAlert).length).toBe(0)
      })
    })
  })

  describe('submit assessment', () => {
    describe('when a new assessment', () => {
      it('should call AssessmentService.postAssessment', () => {
        const assessmentServicePostSpy = jest.spyOn(AssessmentService, 'postAssessment')
        const props = {
          match: { params: { id: 1 } },
          client: childInfoJson,
          isNewForm: false,
        }

        const wrapper = shallow(<AssessmentContainer {...props} />)
        wrapper.instance().handleSubmitAssessment()

        assessmentServicePostSpy.mockReturnValue(Promise.resolve(assessment))
        const expectedArgument = {
          event_date: getCurrentIsoDate(),
          has_caregiver: true,
          person: childInfoJson,
          state: { domains: [] },
          status: 'COMPLETED',
        }
        expect(assessmentServicePostSpy).toHaveBeenCalledWith(expectedArgument)
      })
    })

    describe('when an existing assessment', () => {
      it('should call AssessmentService.update', () => {
        const assessmentServicePutSpy = jest.spyOn(AssessmentService, 'update')
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        assessmentServicePutSpy.mockReturnValue(Promise.resolve(assessment))
        wrapper.setState({ assessment: { id: 1 } })
        wrapper.instance().handleSubmitAssessment()
        expect(assessmentServicePutSpy).toHaveBeenCalledWith(1, { id: 1, person: childInfoJson, status: 'COMPLETED' })
      })
    })
  })

  describe('update assessment', () => {
    describe('is passed updated data', () => {
      it('will update the assessment on the component state', () => {
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        wrapper.setState({ assessment: assessment })
        expect(wrapper.state('assessment')).toEqual(assessment)
        wrapper.instance().updateAssessment(updatedAssessment)
        expect(wrapper.state('assessment')).toEqual(updatedAssessment)
      })

      it('validates assessment for submit', () => {
        const wrapper = shallow(<AssessmentContainer {...defaultProps} />)
        wrapper.setState({ assessment: updatedAssessment })
        expect(wrapper.state('isValidForSubmit')).toEqual(false)
        wrapper.instance().updateAssessment(assessment)
        expect(wrapper.state('isValidForSubmit')).toEqual(true)
      })
    })
  })

  describe('initial save', () => {
    it('will update the assessment on the component state', () => {
      const props = {
        location: { childId: 1 },
        match: { params: { id: 1 } },
        history: { push: jest.fn() },
        client: childInfoJson,
        isNewForm: false,
      }
      const wrapper = shallow(<AssessmentContainer {...props} />)

      wrapper.setState({ assessment: assessment })
      expect(wrapper.state('assessment')).toEqual(assessment)
      wrapper.instance().initialSave(updatedAssessment)
      expect(wrapper.state('assessment')).toEqual(updatedAssessment)
    })

    it('will update the url with the assessment id', () => {
      const historyPushMock = { push: jest.fn() }
      const wrapper = shallow(<AssessmentContainer {...defaultProps} history={historyPushMock} />)

      wrapper.setState({ child: childInfoJson })
      wrapper.instance().initialSave(updatedAssessment)

      expect(historyPushMock.push).toHaveBeenCalledWith('/clients/aaaaaaaaaa/assessments/1')
    })
  })

  describe('buttons', () => {
    describe('Cancel button', () => {
      it('redirects to client page', async () => {
        const wrapper = shallow(
          <AssessmentContainer match={{ params: { id: 1 } }} client={childInfoJson} isNewForm={false} />,
          { disableLifecycleMethods: true }
        )
        await wrapper.instance().handleCancelClick()
        expect(wrapper.state().redirection).toEqual({
          shouldRedirect: true,
        })
        expect(wrapper.find('Redirect').exists()).toBe(true)

        await wrapper.update()
        wrapper.instance().componentDidUpdate()
        expect(wrapper.state().redirection).toEqual({
          shouldRedirect: false,
        })
        expect(wrapper.find('Redirect').exists()).toBe(false)
      })
    })

    describe('Submit button', () => {
      it('is disabled/enabled based on the assessment validity', async () => {
        const wrapper = await mountWithRouter(
          <AssessmentContainer match={{ params: { childId: 123 } }} client={childInfoJson} isNewForm={false} />
        )
        await wrapper
          .find('AssessmentContainer')
          .instance()
          .setState({
            isValidForSubmit: false,
            assessmentServiceStatus: LoadingState.ready,
            isEditable: true,
          })
        await wrapper.update()
        expect(
          wrapper
            .find('button#submit-assessment')
            .first()
            .props().disabled
        ).toBe(true)
        await wrapper
          .find('AssessmentContainer')
          .instance()
          .setState({
            isValidForSubmit: true,
            assessmentServiceStatus: LoadingState.ready,
            isEditable: true,
          })
        await wrapper.update()
        expect(
          wrapper
            .find('button#submit-assessment')
            .first()
            .props().disabled
        ).toBe(false)
      })

      it('redirects to client page on Submit button clicked', async () => {
        const assessmentServicePostSpy = jest.spyOn(AssessmentService, 'postAssessment')
        assessmentServicePostSpy.mockReturnValue(Promise.resolve({ id: 123 }))
        const wrapper = shallow(
          <AssessmentContainer
            match={{ params: { id: 1 } }}
            client={childInfoJson}
            isNewForm={false}
            history={{ push: jest.fn() }}
          />,
          { disableLifecycleMethods: true }
        )
        expect(wrapper.find('Redirect').length).toBe(0)

        await wrapper.instance().handleSubmitAssessment()
        expect(wrapper.state().redirection).toEqual({
          shouldRedirect: true,
          successAssessmentId: 123,
        })
        expect(wrapper.find('Redirect').exists()).toBe(true)

        await wrapper.update()
        wrapper.instance().componentDidUpdate()
        expect(wrapper.state().redirection).toEqual({
          shouldRedirect: false,
          successAssessmentId: 123,
        })
        expect(wrapper.find('Redirect').exists()).toBe(false)
      })
    })

    describe('handleKeyUp', () => {
      let wrapper
      let instance
      beforeEach(() => {
        wrapper = shallow(
          <AssessmentContainer match={{ params: { id: 1 } }} client={childInfoJson} isNewForm={false} />
        )
        instance = wrapper.instance()
      })

      it('should default isValidDate to true', () => {
        expect(instance.state.isValidDate).toEqual(true)
      })

      it('should set isValidDate to true when date is valid', () => {
        instance.setState({ isValidDate: false })
        instance.handleKeyUp({ target: { value: '10/09/2018' } })
        expect(instance.state.isValidDate).toEqual(true)
      })

      it('should set isValidDate to false when date is invalid', () => {
        instance.handleKeyUp({ target: { value: '325982323' } })
        expect(instance.state.isValidDate).toEqual(false)
        instance.handleKeyUp({ target: { value: '10/2019/21' } })
        expect(instance.state.isValidDate).toEqual(false)
        instance.handleKeyUp({ target: { value: '' } })
        expect(instance.state.isValidDate).toEqual(false)
        instance.handleKeyUp({ target: {} })
        expect(instance.state.isValidDate).toEqual(false)
      })
    })

    describe('submit and save buttons', () => {
      it('should disable buttons when assessment service is working', async () => {
        const wrapper = await mountWithRouter(<AssessmentContainer client={childInfoJson} isNewForm={false} />)

        // when
        wrapper
          .find('AssessmentContainer')
          .instance()
          .setState({
            isValidForSubmit: true,
            assessmentServiceStatus: LoadingState.waiting,
          })

        // then
        expect(wrapper.find('Button#save-assessment').instance().props.disabled).toBeTruthy()
        expect(wrapper.find('Button#submit-assessment').instance().props.disabled).toBeTruthy()
      })

      it('should enable buttons when assessment service is not working', async () => {
        const wrapper = await mountWithRouter(<AssessmentContainer client={childInfoJson} isNewForm={false} />)

        // when
        wrapper
          .find('AssessmentContainer')
          .instance()
          .setState({
            isValidForSubmit: true,
            assessmentServiceStatus: LoadingState.ready,
            isEditable: true,
          })

        // then
        expect(wrapper.find('Button#save-assessment').instance().props.disabled).toBeFalsy()
        expect(wrapper.find('Button#submit-assessment').instance().props.disabled).toBeFalsy()
      })

      it('should disable buttons when assessment is not editable', async () => {
        const wrapper = await mountWithRouter(<AssessmentContainer client={childInfoJson} isNewForm={false} />)

        // when
        wrapper
          .find('AssessmentContainer')
          .instance()
          .setState({
            isValidForSubmit: true,
            assessmentServiceStatus: LoadingState.ready,
            isEditable: false,
          })

        // then
        expect(wrapper.find('Button#save-assessment').instance().props.disabled).toBeTruthy()
        expect(wrapper.find('Button#submit-assessment').instance().props.disabled).toBeTruthy()
      })

      it('should disable the save button when date is invalid', async () => {
        const wrapper = await mountWithRouter(<AssessmentContainer client={childInfoJson} isNewForm={false} />)

        // when
        wrapper
          .find('AssessmentContainer')
          .instance()
          .setState({
            isValidDate: false,
            isEditable: true,
            assessment,
          })

        // then
        expect(wrapper.find('Button#save-assessment').instance().props.disabled).toBeTruthy()
      })

      it('should enable the save button when date is valid', async () => {
        const wrapper = await mountWithRouter(<AssessmentContainer client={childInfoJson} isNewForm={false} />)

        // when
        wrapper
          .find('AssessmentContainer')
          .instance()
          .setState({
            isValidDate: true,
            isEditable: true,
            assessment,
          })

        // then
        expect(wrapper.find('Button#save-assessment').instance().props.disabled).toBeFalsy()
      })
    })
  })
})
