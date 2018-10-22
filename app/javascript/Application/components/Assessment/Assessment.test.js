import React from 'react'
import { Assessment, Domain } from './'
import { mount, shallow } from 'enzyme'
import { clone } from '../../util/common'

import { assessment, i18n } from './assessment.mocks.test'

const enhanceDomainToCaregiver = domain => ({ ...domain, is_caregiver_domain: true, caregiver_index: 'a' })

describe('<Assessment />', () => {
  describe('assessment form with data', () => {
    it('renders with 1 <Domain /> component', () => {
      const wrapper = mount(<Assessment assessment={assessment} onAssessmentUpdate={jest.fn()} i18n={i18n} />)
      expect(wrapper.find(Domain).length).toBe(1)
    })
  })

  describe('componentDidUpdate', () => {
    describe('hasCaregiver is true', () => {
      it('should add initial caregiver', () => {
        // given
        const initialAssessment = clone(assessment)
        let updatedAssessment = clone(assessment)
        const mockFn = jest.fn()
        const wrapper = shallow(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />)

        // when
        updatedAssessment.has_caregiver = true
        wrapper.setProps({ assessment: updatedAssessment })

        // then
        const finalAssessment = mockFn.mock.calls[0][0]
        expect(finalAssessment.state.domains[0].caregiver_index).toEqual('a')
      })
    })

    describe('hasCaregiver is false', () => {
      it('should remove caregiver domains', () => {
        // given
        let initialAssessment = clone(assessment)
        let updatedAssessment = clone(assessment)
        initialAssessment.has_caregiver = true
        initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
        initialAssessment.state.domains.push({ ...initialAssessment.state.domains[0], caregiver_index: 'b' })
        initialAssessment.state.domains.push({ ...initialAssessment.state.domains[0], caregiver_index: 'c' })
        const mockFn = jest.fn()
        const wrapper = shallow(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />)

        // when
        updatedAssessment.has_caregiver = false
        expect(initialAssessment.state.domains.length).toBe(3)
        wrapper.setProps({ assessment: updatedAssessment })

        // then
        const finalAssessment = mockFn.mock.calls[0][0]
        expect(finalAssessment.state.domains.length).toBe(1)
      })
    })
  })

  describe('#updateItem()', () => {
    describe('handleUpdateItem call backs', () => {
      describe('rating', () => {
        it('is invoked when item rating is updated', () => {
          const mockFn = jest.fn()
          const wrapper = mount(<Assessment onAssessmentUpdate={mockFn} assessment={assessment} i18n={i18n} />)
          expect(assessment.state.domains[0].items[0].rating).toBe(1)
          wrapper.instance().handleUpdateItemRating('1', 2)
          const newAssessment = clone(assessment)
          newAssessment.state.domains[0].items[0].rating = 2
          expect(mockFn).toHaveBeenCalledWith(newAssessment)
        })

        it('is invoked when item rating is updated for caregiver domain', () => {
          // given
          const mockFn = jest.fn()
          const initialAssessment = clone(assessment)
          initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
          const wrapper = mount(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />)

          // when
          expect(initialAssessment.state.domains[0].items[0].rating).toBe(1)
          wrapper.instance().handleUpdateItemRating('1', 2, 'a')

          // then
          const updatedAssessment = clone(assessment)
          updatedAssessment.state.domains[0] = enhanceDomainToCaregiver(updatedAssessment.state.domains[0])
          updatedAssessment.state.domains[0].items[0].rating = 2
          expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
        })
      })

      describe('confidentiality', () => {
        it('is invoked when item confidentiality is updated', () => {
          const mockFn = jest.fn()
          const initialAssessment = clone(assessment)
          const wrapper = mount(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />)
          expect(initialAssessment.state.domains[0].items[3].confidential).toBe(false)
          wrapper.instance().handleUpdateItemConfidentiality('EXPOSURE', true)
          const newAssessment = clone(assessment)
          newAssessment.state.domains[0].items[3].confidential = true
          expect(mockFn).toHaveBeenCalledWith(newAssessment)
        })

        it('is invoked when item confidentiality is updated for caregiver domain', () => {
          // given
          const mockFn = jest.fn()
          const initialAssessment = clone(assessment)
          initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
          const wrapper = mount(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />)

          // when
          expect(initialAssessment.state.domains[0].items[3].confidential).toBe(false)
          wrapper.instance().handleUpdateItemConfidentiality('EXPOSURE', true, 'a')

          // then
          const updatedAssessment = clone(assessment)
          updatedAssessment.state.domains[0] = enhanceDomainToCaregiver(updatedAssessment.state.domains[0])
          updatedAssessment.state.domains[0].items[3].confidential = true
          expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
        })
      })
    })
  })

  describe('#updateCaregiverName()', () => {
    describe('onCareGiverNameUpdate call back', () => {
      it('is invoked when caregiver name is updated', () => {
        // given
        const mockFn = jest.fn()
        const initialAssessment = clone(assessment)
        initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
        const wrapper = mount(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />)
        expect(initialAssessment.state.domains[0].caregiver_name).toBeUndefined()

        // when
        wrapper.instance().updateCaregiverName('a', 'New Name')

        // then
        const updatedAssessment = clone(assessment)
        updatedAssessment.state.domains[0] = enhanceDomainToCaregiver(updatedAssessment.state.domains[0])
        updatedAssessment.state.domains[0].caregiver_name = 'New Name'
        expect(mockFn).toHaveBeenCalledWith(updatedAssessment)
      })
    })
  })

  describe('caregiver domain', () => {
    describe('#addInitialCaregiverDomain', () => {
      it('adds initial caregiver domain to the assessment', () => {
        // given
        const initialAssessment = clone(assessment)
        const mockFn = jest.fn()
        const wrapper = shallow(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />)

        // when
        wrapper.instance().addInitialCaregiverDomain()

        // then
        const updatedAssessment = mockFn.mock.calls[0][0]
        expect(updatedAssessment.state.domains[0].caregiver_index).toEqual('a')
      })
    })

    describe('#addCaregiverDomainAfter', () => {
      it('adds additional caregiver domain', () => {
        // given
        const initialAssessment = clone(assessment)
        initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
        const mockFn = jest.fn()
        const wrapper = shallow(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />)
        const instance = wrapper.instance()

        // when
        instance.addCaregiverDomainAfter('a')

        // then
        const updatedAssessment = mockFn.mock.calls[0][0]
        expect(updatedAssessment.state.domains.map(domain => domain.caregiver_index)).toEqual(['a', 'b'])
      })
    })

    describe('#removeCaregiverDomain', () => {
      describe('assessment has multiple caregiver domain', () => {
        it('removes the caregiver domain and reset the caregiver indexes', () => {
          // given
          const initialAssessment = clone(assessment)
          initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
          initialAssessment.state.domains.push({ ...initialAssessment.state.domains[0], caregiver_index: 'b' })
          initialAssessment.state.domains.push({ ...initialAssessment.state.domains[0], caregiver_index: 'c' })
          const mockFn = jest.fn()
          const wrapper = shallow(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />)
          const instance = wrapper.instance()

          // when
          instance.removeCaregiverDomain('b')

          // then
          const updatedAssessment = mockFn.mock.calls[0][0]
          expect(updatedAssessment.state.domains.map(domain => domain.caregiver_index)).toEqual(['a', 'b'])
        })
      })

      describe('assessment has only one caregiver domain', () => {
        it('removes the caregiver domain and sets hasCaregiver to false', () => {
          const initialAssessment = clone(assessment)
          initialAssessment.has_caregiver = true
          initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
          const mockFn = jest.fn()
          const wrapper = shallow(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />)
          const instance = wrapper.instance()

          // when
          instance.removeCaregiverDomain('a')

          // then
          const updatedAssessment = mockFn.mock.calls[0][0]
          expect(updatedAssessment.state.domains.map(domain => domain.caregiver_index).length).toBe(0)
          expect(updatedAssessment.has_caregiver).toBe(false)
        })
      })
    })

    describe('#removeAllCaregiverDomains', () => {
      it('removes all caregiver domains from the domains list', () => {
        // given
        const initialAssessment = clone(assessment)
        initialAssessment.state.domains[0] = enhanceDomainToCaregiver(initialAssessment.state.domains[0])
        initialAssessment.state.domains.push({ ...initialAssessment.state.domains[0], caregiver_index: 'b' })
        initialAssessment.state.domains.push({ ...initialAssessment.state.domains[0], caregiver_index: 'c' })
        const mockFn = jest.fn()
        const wrapper = shallow(<Assessment onAssessmentUpdate={mockFn} assessment={initialAssessment} i18n={i18n} />)

        expect(initialAssessment.state.domains.length).toBe(3)

        // when
        wrapper.instance().removeAllCaregiverDomains()

        // then
        const updatedAssessment = mockFn.mock.calls[0][0]
        expect(updatedAssessment.state.domains.length).toBe(0)
      })
    })
  })
})
