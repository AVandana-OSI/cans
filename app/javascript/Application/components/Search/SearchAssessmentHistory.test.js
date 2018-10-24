import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid/Grid'
import { SearchAssessmentHistory } from './index'
import AssessmentService from '../Assessment/Assessment.service'
import SearchAssessmentHistoryRecord from './SearchAssessmentHistoryRecord'

jest.mock('../Assessment/Assessment.service')

const params = {
  clientIds: [],
  historyTitle: 'Assessment History',
  numAssessments: 3,
}

const getShallowWrapper = () => {
  AssessmentService.search.mockReturnValue(
    Promise.resolve([
      { id: 1, person: { id: 100 }, status: 'IN_PROGRESS', county: { name: 'Yolo' } },
      { id: 2, person: { id: 200 }, status: 'IN_PROGRESS', county: { name: 'Yolo' } },
      { id: 3, person: { id: 300 }, status: 'IN_PROGRESS', county: { name: 'Yolo' } },
    ])
  )
  return shallow(<SearchAssessmentHistory {...params} />)
}

const prepareWrapper = async mockedAssessments => {
  // given
  AssessmentService.search.mockReturnValue(Promise.resolve(mockedAssessments))
  const wrapper = shallow(<SearchAssessmentHistory {...params} />)

  // when
  wrapper.setProps({ clientIds: [1004, 1005] })
  await wrapper.instance().componentDidUpdate(params)

  return wrapper
}

describe('<SearchAssessmentHistory', () => {
  describe('components', () => {
    const getLength = component => getShallowWrapper().find(component).length

    it('renders with 1 <Grid /> component', () => {
      expect(getLength(Grid)).toBe(1)
    })
  })

  describe('assessment history', () => {
    describe('when 3 records', () => {
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

    describe('when 0 records', () => {
      it('renders the empty message', async () => {
        // given + when
        const wrapper = await prepareWrapper([])

        // then
        const message = wrapper.find('#no-data').text()
        expect(message).toBe('No assessments currently exist for this child/youth.')
      })
    })
  })
})
