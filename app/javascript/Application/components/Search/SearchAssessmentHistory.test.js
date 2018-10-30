import React from 'react'
import { shallow } from 'enzyme'
import { Card, CardHeader, CardBody } from '@cwds/components/lib/Cards'
import CardTitle from '@cwds/components/lib/Cards/CardTitle'
import { SearchAssessmentHistory } from './index'
import AssessmentService from '../Assessment/Assessment.service'
import SearchAssessmentHistoryRecord from './SearchAssessmentHistoryRecord'

jest.mock('../Assessment/Assessment.service')

const params = {
  numAssessments: 3,
}

const getShallowWrapper = () => {
  AssessmentService.getAllAssessments.mockReturnValue(
    Promise.resolve([
      {
        id: 1,
        person: { id: 100 },
        status: 'IN_PROGRESS',
        county: { name: 'Yolo' },
      },
      {
        id: 2,
        person: { id: 200 },
        status: 'IN_PROGRESS',
        county: { name: 'Yolo' },
      },
      {
        id: 3,
        person: { id: 300 },
        status: 'IN_PROGRESS',
        county: { name: 'Yolo' },
      },
    ])
  )
  return shallow(<SearchAssessmentHistory {...params} />)
}

const prepareWrapper = async mockedAssessments => {
  // given
  AssessmentService.getAllAssessments.mockReturnValue(Promise.resolve(mockedAssessments))
  const wrapper = shallow(<SearchAssessmentHistory {...params} />)

  // when
  await wrapper.instance().componentDidMount()

  return wrapper
}

describe('<SearchAssessmentHistory', () => {
  describe('components', () => {
    const wrapper = getShallowWrapper()

    it('renders a card', () => {
      expect(wrapper.find(Card).exists()).toBe(true)
    })

    it('renders a card header', () => {
      expect(wrapper.find(CardHeader).exists()).toBe(true)
    })

    it('renders a card title', () => {
      expect(wrapper.find(CardTitle).exists()).toBe(true)
    })

    it('renders a card body', () => {
      expect(wrapper.find(CardBody).exists()).toBe(true)
    })
  })

  describe('card title', () => {
    it('should be "Assessment History"', () => {
      const wrapper = getShallowWrapper()
      const cardTitle = wrapper.find(CardTitle).props().children
      expect(cardTitle).toMatch(/Assessment History/)
    })
  })

  describe('assessment history', () => {
    describe('when 3 assessments', () => {
      it('renders 3 assessments', async () => {
        // given + when
        const wrapper = await prepareWrapper([
          { id: 1, status: 'IN_PROGRESS' },
          { id: 2, status: 'IN_PROGRESS' },
          { id: 3, status: 'IN_PROGRESS' },
        ])

        // then
        expect(wrapper.find(SearchAssessmentHistoryRecord).length).toBe(3)
      })
    })

    describe('renders 0 assessments', () => {
      it('renders the empty message when there are zero assessments', async () => {
        // given + when
        const wrapper = await prepareWrapper([])

        // then
        const message = wrapper.find('#no-data').text()
        expect(message).toBe('No assessments currently exist for the clients.')
      })
    })
  })
})
