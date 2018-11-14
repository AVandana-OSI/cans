import React from 'react'
import { shallow, mount } from 'enzyme'
import { AssessmentFormHeader } from './index'
import { Alert } from '@cwds/components'
import { assessment, client } from './assessment.mocks.test'
import { clone } from '../../util/common'
import ConductedByField from './ConductedByField'
import { Card, CardHeader, CardContent } from '@material-ui/core'

describe('<AssessmentFormHeader />', () => {
  describe('components', () => {
    const getShallowWrapper = () =>
      shallow(<AssessmentFormHeader {...{ assessment, client, onAssessmentUpdate: jest.fn() }} />)
    const getLength = component => getShallowWrapper().find(component).length

    it('renders with 3 assessment-form-header-label labels', () => {
      expect(getLength('.assessment-form-header-label')).toBe(3)
    })

    it('renders with 1 <ConductedByField> component', () => {
      expect(getLength(ConductedByField)).toBe(1)
    })
  })

  it('displays age buttons as unselected when under_six is undefined', () => {
    const agelessAssessment = { ...assessment, state: { ...assessment.state, under_six: undefined } }
    const wrapper = shallow(
      <AssessmentFormHeader assessment={agelessAssessment} client={client} onAssessmentUpdate={jest.fn()} />
    )
    expect(wrapper.find('.age-button').length).toBe(2)
    expect(wrapper.find('.age-button-selected').exists()).toBe(false)
  })

  it('selects first age button when under_six is true', () => {
    const agelessAssessment = { ...assessment, state: { ...assessment.state, under_six: true } }
    const wrapper = shallow(
      <AssessmentFormHeader assessment={agelessAssessment} client={client} onAssessmentUpdate={jest.fn()} />
    )
    expect(wrapper.find('.age-button-selected').html()).toContain('Age: 0-5')
  })

  it('selects second age button when under_six is false', () => {
    const agelessAssessment = { ...assessment, state: { ...assessment.state, under_six: false } }
    const wrapper = shallow(
      <AssessmentFormHeader assessment={agelessAssessment} client={client} onAssessmentUpdate={jest.fn()} />
    )
    expect(wrapper.find('.age-button-selected').html()).toContain('Age: 6-21')
  })

  describe('case number', () => {
    it('renders with case number', () => {
      const clientWithCases = clone(client)
      clientWithCases.cases = [{ id: 101, external_id: '1001' }, { id: 102, external_id: '1002' }]
      const props = { assessment, client: clientWithCases, onAssessmentUpdate: jest.fn(), onKeyUp: jest.fn() }
      const caseNumber = shallow(<AssessmentFormHeader {...props} />).find('#case-number')
      expect(caseNumber.text()).toBe('1001')
    })

    it('renders without case number when not exists', () => {
      const props = { assessment, client, onAssessmentUpdate: jest.fn(), onKeyUp: jest.fn() }
      const caseNumber = shallow(<AssessmentFormHeader {...props} />).find('#case-number')
      expect(caseNumber.text()).toBe('')
    })
  })

  describe('renders 5 assessment-form-header-label labels with correct text', () => {
    let wrapped
    beforeEach(() => {
      wrapped = shallow(<AssessmentFormHeader {...{ assessment, client, onAssessmentUpdate: jest.fn() }} />)
    })

    it('renderDateSelect() returns correct label text', () => {
      expect(
        mount(wrapped.instance().renderDateSelect())
          .find('Label')
          .text()
      ).toBe('Assessment Date *')
    })

    it('renderCaseNumber() returns correct label text', () => {
      expect(
        mount(wrapped.instance().renderCaseNumber())
          .find('Label')
          .text()
      ).toBe('Case Number')
    })

    it('renderHasCaregiverQuestion() returns correct label text', () => {
      expect(
        mount(wrapped.instance().renderHasCaregiverQuestion())
          .find('Typography')
          .first()
          .text()
      ).toBe('Child/Youth has Caregiver?')
    })

    it('renderCanReleaseInfoQuestion() returns correct label text', () => {
      expect(
        mount(wrapped.instance().renderCanReleaseInfoQuestion())
          .find('Typography')
          .first()
          .text()
      ).toBe('Authorization for release of information on file?')
    })
  })

  describe('#handleValueChange()', () => {
    it('will update event_date in assessment', () => {
      // given
      const mockFn = jest.fn()
      const props = { assessment, client, onAssessmentUpdate: mockFn }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      expect(assessment.event_date).toBe('2018-06-11')
      // when
      const event = { target: { name: 'event_date', value: '2000-01-11' } }
      wrapper.instance().handleValueChange(event)
      // then
      const updatedAssessment = clone(assessment)
      updatedAssessment.event_date = '2000-01-11'
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
    })
  })

  describe('#handleHasCaregiverChange()', () => {
    it('will update has_caregiver in assessment', () => {
      // given
      const mockFn = jest.fn()
      const sentAssessment = clone(assessment)
      sentAssessment.has_caregiver = true
      const props = { assessment: sentAssessment, client, onAssessmentUpdate: mockFn }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)

      // when
      const event = { target: { name: 'has_caregiver', value: 'false' } }
      wrapper.instance().handleHasCaregiverChange(event)

      // then
      const updatedAssessment = clone(assessment)
      updatedAssessment.has_caregiver = false
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
    })
  })

  describe('#handleSelectCaseNumber()', () => {
    it('will update case in assessment with a case object', () => {
      // given
      const mockFn = jest.fn()
      const sentAssessment = clone(assessment)
      const clientWithCases = clone(client)
      clientWithCases.cases = [
        { id: 101, external_id: '1001' },
        { id: 102, external_id: '1002' },
        { id: 103, external_id: '1003' },
      ]
      const props = { assessment: sentAssessment, client: clientWithCases, onAssessmentUpdate: mockFn }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)

      // when
      wrapper.instance().handleSelectCaseNumber({ target: { value: '1002' } })

      // then
      const updatedAssessment = clone(assessment)
      updatedAssessment.the_case = { id: 102, external_id: '1002' }
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
    })

    it('will update case in assessment with an undefined value', () => {
      // given
      const mockFn = jest.fn()
      const sentAssessment = clone(assessment)
      sentAssessment.the_case = { id: 101, external_id: '1001' }
      const props = { assessment: sentAssessment, client: clone(client), onAssessmentUpdate: mockFn }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)

      // when
      wrapper.instance().handleSelectCaseNumber({ target: { value: undefined } })

      // then
      const updatedAssessment = clone(assessment)
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
    })
  })

  describe('#handleCanReleaseInfoChange()', () => {
    it('will update can_release_confidential_info in assessment and set confidential_by_default items to confidential', () => {
      // given
      const mockFn = jest.fn()
      const sentAssessment = clone(assessment)
      sentAssessment.can_release_confidential_info = true
      const props = { assessment: sentAssessment, client, onAssessmentUpdate: mockFn }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      expect(sentAssessment.state.domains[0].items[3].confidential).toBe(false)
      // when
      const event = { target: { name: 'can_release_confidential_info', value: 'false' } }
      wrapper.instance().handleCanReleaseInfoChange(event)
      // then
      const updatedAssessment = clone(assessment)
      updatedAssessment.can_release_confidential_info = false
      updatedAssessment.state.domains[0].items[3].confidential = true
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
    })
  })

  describe('#updateUnderSix()', () => {
    it('will set under_six to its opposite', () => {
      // given
      const mockFn = jest.fn()
      const props = { assessment, client, onAssessmentUpdate: mockFn }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      expect(assessment.state.under_six).toBe(false)
      // when
      wrapper.instance().updateUnderSix(true)
      // then
      const updatedAssessment = clone(assessment)
      updatedAssessment.state.under_six = true
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
    })
  })

  describe('with client', () => {
    it('displays correct client name', () => {
      const props = { assessment, client, onAssessmentUpdate: jest.fn() }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      const headerTitle = shallow(wrapper.find(CardHeader).props().title)
      expect(headerTitle.find('#child-name').text()).toBe('Doe, John')
    })
  })

  describe('with no client', () => {
    it('displays default message', () => {
      const props = { assessment, client: {}, onAssessmentUpdate: jest.fn() }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      const headerTitle = shallow(wrapper.find(CardHeader).props().title)
      expect(headerTitle.find('#no-data').text()).toBe('Client Info')
    })
  })

  describe('with county', () => {
    it('displays correct county name', () => {
      const props = { assessment, client, onAssessmentUpdate: jest.fn() }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      const headerAction = shallow(wrapper.find(CardHeader).props().action)
      expect(headerAction.find('#county-name').text()).toBe('Calaveras County')
    })
  })

  describe('warning alert', () => {
    it('should render Alert component when canReleaseInformation is false', () => {
      const props = { assessment, client, onAssessmentUpdate: jest.fn() }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      const alert = wrapper.find('Alert')
      expect(alert.length).toBe(1)
      expect(wrapper.find('Alert').html()).toMatch(
        'By selecting NO, Items 7, 48, and EC 41 (Substance Use Disorder Items) from this CANS assessment will be redacted when printed.'
      )
    })

    it('should not render Alert component when canReleaseInformation is true', () => {
      const sentAssessment = clone(assessment)
      sentAssessment.can_release_confidential_info = true
      const props = { assessment: sentAssessment, client, onAssessmentUpdate: jest.fn() }

      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      const alert = wrapper.find(Alert)
      expect(alert.length).toBe(0)
    })
  })

  describe('Assessment Conducted by', () => {
    const mockFn = jest.fn()
    it('renders input', () => {
      const props = { assessment, client, onAssessmentUpdate: mockFn }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      expect(wrapper.find('#conducted-by').length).toBe(1)
    })

    it('disabled when assessment completed ', () => {
      const completedAssessment = clone(assessment)
      completedAssessment.status = 'COMPLETED'
      const props = { assessment: completedAssessment, client, onAssessmentUpdate: mockFn }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)
      expect(wrapper.find('#conducted-by').prop('isDisabled')).toBeTruthy()
    })

    describe('#handleConductedByChange', () => {
      it('calls onAssessmentUpdate when conducted_by is changed', () => {
        const conductedByValue = 'NAME'
        const props = { assessment, client, onAssessmentUpdate: mockFn }
        const wrapper = shallow(<AssessmentFormHeader {...props} />)
        const event = { target: { name: 'conducted_by', value: conductedByValue } }
        wrapper
          .find('#conducted-by')
          .props()
          .onChange(event)
        const updatedAssessment = clone(assessment)
        updatedAssessment.conducted_by = conductedByValue
        expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
      })
    })
  })

  describe('AssessmentFormHeader Card', () => {
    describe('when loading', () => {
      const props = { assessment, client, onAssessmentUpdate: jest.fn() }
      const wrapper = shallow(<AssessmentFormHeader {...props} />)

      it('renders AssessmentFormHeader Card ', () => {
        const card = wrapper.find(Card)
        expect(card.exists()).toBe(true)
      })

      it('has a card header', () => {
        expect(wrapper.find(CardHeader).exists()).toBe(true)
      })

      it('has a card content', () => {
        expect(wrapper.find(CardContent).exists()).toBe(true)
      })
    })
  })
})
