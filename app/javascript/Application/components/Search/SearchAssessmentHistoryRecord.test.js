import React from 'react'
import { shallow } from 'enzyme'
import { Link } from 'react-router-dom'
import { Container } from 'reactstrap'
import SearchAssessmentHistoryRecord from './SearchAssessmentHistoryRecord'
import AssessmentRecordIcon from '../common/AssessmentRecordIcon'
import AssessmentRecordInfo from '../common/AssessmentRecordInfo'
import { assessmentInProgress, assessmentWithNoUpdateInfo } from '../Assessment/assessment.mocks.test'

jest.mock('../Assessment/Assessment.service')

const getShallowWrapper = assessment => shallow(<SearchAssessmentHistoryRecord assessment={assessment} />)

describe('<SearchAssessmentHistory', () => {
  describe('In Progress Assessment', () => {
    it('renders one Container with the "search-history-item" class', () => {
      // given + when
      const wrapper = getShallowWrapper(assessmentInProgress)

      // then
      expect(wrapper.type()).toEqual(Container)
      expect(wrapper.find(Container).length).toEqual(1)
      expect(wrapper.find('.search-history-item').length).toEqual(1)
    })

    it('renders an in progress AssessmentRecordIcon component', () => {
      // given + when
      const wrapper = getShallowWrapper(assessmentInProgress)

      // then
      expect(wrapper.find(AssessmentRecordIcon).length).toEqual(1)
    })

    it('renders the "In Progress" status', () => {
      // given + when
      const wrapper = getShallowWrapper(assessmentInProgress)

      // then
      expect(wrapper.find('.assessment-status span').length).toEqual(1)
      expect(wrapper.find('.assessment-status span').text()).toEqual('In Progress')
    })

    it('renders a Link component', () => {
      // given + when
      const wrapper = getShallowWrapper(assessmentInProgress)

      // then
      expect(wrapper.find(Link).length).toEqual(1)
      expect(
        wrapper
          .find(Link)
          .children()
          .text()
      ).toEqual('10/10/2015 CANS')
    })

    it('renders a AssessmentRecordInfo component', () => {
      // given + when
      const wrapper = getShallowWrapper(assessmentInProgress)

      // then
      expect(wrapper.find(AssessmentRecordInfo).length).toEqual(1)
    })
  })

  describe('Assessment with no updated_by info (create info only)', () => {
    it('renders one Container with the "search-history-item" class', () => {
      // given + when
      const wrapper = getShallowWrapper(assessmentWithNoUpdateInfo)

      // then
      expect(wrapper.type()).toEqual(Container)
      expect(wrapper.find(Container).length).toEqual(1)
      expect(wrapper.find('.search-history-item').length).toEqual(1)
    })

    it('renders an in progress AssessmentRecordIcon component', () => {
      // given + when
      const wrapper = getShallowWrapper(assessmentWithNoUpdateInfo)

      // then
      expect(wrapper.find(AssessmentRecordIcon).length).toEqual(1)
    })

    it('renders the "In Progress" status', () => {
      // given + when
      const wrapper = getShallowWrapper(assessmentWithNoUpdateInfo)

      // then
      expect(wrapper.find('.assessment-status span').length).toEqual(1)
      expect(wrapper.find('.assessment-status span').text()).toEqual('In Progress')
    })

    it('renders a Link component', () => {
      // given + when
      const wrapper = getShallowWrapper(assessmentWithNoUpdateInfo)

      // then
      expect(wrapper.find(Link).length).toEqual(1)
      expect(
        wrapper
          .find(Link)
          .children()
          .text()
      ).toEqual('01/05/2018 CANS')
    })

    it('renders a AssessmentRecordInfo component', () => {
      // given + when
      const wrapper = getShallowWrapper(assessmentWithNoUpdateInfo)

      // then
      expect(wrapper.find(AssessmentRecordInfo).length).toEqual(1)
    })
  })
})
