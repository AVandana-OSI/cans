import React from 'react';
import { shallow, mount } from 'enzyme';
import { AssessmentFormHeader } from './index';
import { Alert } from '@cwds/components';
import { assessment, client } from './assessment.mocks.test';
import { clone } from '../../util/common';
import { Input } from 'reactstrap';

describe('<AssessmentFormHeader />', () => {
  describe('components', () => {
    const getShallowWrapper = () =>
      shallow(<AssessmentFormHeader {...{ assessment, client, onAssessmentUpdate: jest.fn() }} />);
    const getLength = component => getShallowWrapper().find(component).length;

    it('renders with 5 assessment-form-header-label labels', () => {
      expect(getLength('.assessment-form-header-label')).toBe(4);
    });

    it('renders with 2 <Input /> component', () => {
      expect(getLength(Input)).toBe(2);
    });

    it('renders with case numbers dropdown', () => {
      const clientWithCases = clone(client);
      clientWithCases.cases = [{ id: 101, external_id: '1001' }, { id: 102, external_id: '1002' }];
      const props = { assessment, client: clientWithCases, onAssessmentUpdate: jest.fn(), onKeyUp: jest.fn() };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      const caseNumberOptions = wrapper
        .find('#select-case')
        .dive()
        .find('option');
      expect(caseNumberOptions.length).toBe(3);
      expect(caseNumberOptions.map(option => option.get(0).props.value)).toEqual([undefined, '1002', '1001']);
    });
  });

  describe('renders 5 assessment-form-header-label labels with correct text', () => {
    let wrapped;
    beforeEach(() => {
      wrapped = shallow(<AssessmentFormHeader {...{ assessment, client, onAssessmentUpdate: jest.fn() }} />);
    });

    it('renderDateSelect() returns correct label text', () => {
      expect(
        mount(wrapped.instance().renderDateSelect())
          .find('Label')
          .text()
      ).toBe('Assessment Date *');
    });

    it('renderCaseSelect() returns correct label text', () => {
      expect(
        mount(wrapped.instance().renderCaseSelect())
          .find('Label')
          .text()
      ).toBe('Case Number');
    });

    it('renderCompletedAsSelect() returns correct label text', () => {
      expect(
        mount(wrapped.instance().renderCompletedAsSelect())
          .find('Label')
          .text()
      ).toBe('Complete as');
    });

    it('renderHasCaregiverQuestion() returns correct label text', () => {
      expect(
        mount(wrapped.instance().renderHasCaregiverQuestion())
          .find('Typography')
          .first()
          .text()
      ).toBe('Child/Youth has Caregiver?');
    });

    it('renderCanReleaseInfoQuestion() returns correct label text', () => {
      expect(
        mount(wrapped.instance().renderCanReleaseInfoQuestion())
          .find('Typography')
          .first()
          .text()
      ).toBe('Authorization for release of information on file?');
    });
  });

  describe('#handleValueChange()', () => {
    it('will update event_date in assessment', () => {
      // given
      const mockFn = jest.fn();
      const props = { assessment, client, onAssessmentUpdate: mockFn };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      expect(assessment.event_date).toBe('2018-06-11');
      // when
      const event = { target: { name: 'event_date', value: '2000-01-11' } };
      wrapper.instance().handleValueChange(event);
      // then
      const updatedAssessment = clone(assessment);
      updatedAssessment.event_date = '2000-01-11';
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment);
    });

    it('will update completed_as in assessment', () => {
      // given
      const mockFn = jest.fn();
      const props = { assessment, client, onAssessmentUpdate: mockFn };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      expect(assessment.completed_as).toBe('COMMUNIMETRIC');
      // when
      const event = { target: { name: 'completed_as', value: 'Social Worker' } };
      wrapper.instance().handleValueChange(event);
      // then
      const updatedAssessment = clone(assessment);
      updatedAssessment.completed_as = 'Social Worker';
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment);
    });
  });

  describe('#handleHasCaregiverChange()', () => {
    it('will update has_caregiver in assessment', () => {
      // given
      const mockFn = jest.fn();
      const sentAssessment = clone(assessment);
      sentAssessment.has_caregiver = true;
      const props = { assessment: sentAssessment, client, onAssessmentUpdate: mockFn };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);

      // when
      const event = { target: { name: 'has_caregiver', value: 'false' } };
      wrapper.instance().handleHasCaregiverChange(event);

      // then
      const updatedAssessment = clone(assessment);
      updatedAssessment.has_caregiver = false;
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment);
    });
  });

  describe('#handleSelectCaseNumber()', () => {
    it('will update case in assessment with a case object', () => {
      // given
      const mockFn = jest.fn();
      const sentAssessment = clone(assessment);
      const clientWithCases = clone(client);
      clientWithCases.cases = [
        { id: 101, external_id: '1001' },
        { id: 102, external_id: '1002' },
        { id: 103, external_id: '1003' },
      ];
      const props = { assessment: sentAssessment, client: clientWithCases, onAssessmentUpdate: mockFn };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);

      // when
      wrapper.instance().handleSelectCaseNumber({ target: { value: '1002' } });

      // then
      const updatedAssessment = clone(assessment);
      updatedAssessment.the_case = { id: 102, external_id: '1002' };
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment);
    });

    it('will update case in assessment with an undefined value', () => {
      // given
      const mockFn = jest.fn();
      const sentAssessment = clone(assessment);
      sentAssessment.the_case = { id: 101, external_id: '1001' };
      const props = { assessment: sentAssessment, client: clone(client), onAssessmentUpdate: mockFn };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);

      // when
      wrapper.instance().handleSelectCaseNumber({ target: { value: undefined } });

      // then
      const updatedAssessment = clone(assessment);
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment);
    });
  });

  describe('#handleCanReleaseInfoChange()', () => {
    it('will update can_release_confidential_info in assessment and set confidential_by_default items to confidential', () => {
      // given
      const mockFn = jest.fn();
      const sentAssessment = clone(assessment);
      sentAssessment.can_release_confidential_info = true;
      const props = { assessment: sentAssessment, client, onAssessmentUpdate: mockFn };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      expect(sentAssessment.state.domains[0].items[3].confidential).toBe(false);
      // when
      const event = { target: { name: 'can_release_confidential_info', value: 'false' } };
      wrapper.instance().handleCanReleaseInfoChange(event);
      // then
      const updatedAssessment = clone(assessment);
      updatedAssessment.can_release_confidential_info = false;
      updatedAssessment.state.domains[0].items[3].confidential = true;
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment);
    });
  });

  describe('#toggleUnderSix()', () => {
    it('will set under_six to its opposite', () => {
      // given
      const mockFn = jest.fn();
      const props = { assessment, client, onAssessmentUpdate: mockFn };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      expect(assessment.state.under_six).toBe(false);
      // when
      wrapper.instance().toggleUnderSix();
      // then
      const updatedAssessment = clone(assessment);
      updatedAssessment.state.under_six = true;
      expect(mockFn).toHaveBeenCalledWith(updatedAssessment);
    });
  });

  describe('with client', () => {
    it('displays correct client name', () => {
      const props = { assessment, client, onAssessmentUpdate: jest.fn() };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      expect(wrapper.find('#child-name').text()).toBe('Doe, John');
      expect(wrapper.find('#county-name').text()).toBe('Calaveras County');
    });
  });

  describe('with no client', () => {
    it('displays default message', () => {
      const props = { assessment, client: {}, onAssessmentUpdate: jest.fn() };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      expect(wrapper.find('#no-data').text()).toBe('Client Info');
    });
  });

  describe('warning alert', () => {
    it('should render Alert component when canReleaseInformation is false', () => {
      const props = { assessment, client, onAssessmentUpdate: jest.fn() };
      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      const alert = wrapper.find(Alert);
      expect(alert.length).toBe(1);
      expect(wrapper.find(Alert).html()).toMatch(
        /Since there is no Authorization for Release of Information on file, prior to sharing this CANS assessment redact the following domain item numbers: 7, 48, and EC.41./
      );
    });

    it('should not render Alert component when canReleaseInformation is true', () => {
      const sentAssessment = clone(assessment);
      sentAssessment.can_release_confidential_info = true;
      const props = { assessment: sentAssessment, client, onAssessmentUpdate: jest.fn() };

      const wrapper = shallow(<AssessmentFormHeader {...props} />);
      const alert = wrapper.find(Alert);
      expect(alert.length).toBe(0);
    });
  });
});
