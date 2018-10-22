import React from 'react'
import { shallow } from 'enzyme'
import { Link } from 'react-router-dom'
import ClientAssessmentHistoryRecord from './ClientAssessmentHistoryRecord'

jest.mock('../Assessment/Assessment.service')

const assessmentInProgress = {
  id: 97501,
  person: { id: 1 },
  status: 'IN_PROGRESS',
  the_case: {
    external_id: '4444-333-4444-88888888',
  },
  event_date: '2015-10-10',
  updated_timestamp: '2015-06-06T15:37:32.000Z',
  updated_by: {
    first_name: 'Name 1',
    last_name: 'LastName 1',
  },
  county: {
    name: 'Alameda',
  },
}

const assessmentSubmitted = {
  id: 97502,
  person: { id: 1 },
  status: 'SUBMITTED',
  event_date: '2018-01-05',
  updated_timestamp: '2018-06-06T15:37:32.000Z',
  updated_by: {
    first_name: 'Name 2',
    last_name: 'LastName 2',
  },
  county: {
    name: 'Alameda',
  },
}

const assessmentWithNoUpdateInfo = {
  id: 97503,
  person: { id: 1 },
  status: 'IN_PROGRESS',
  event_date: '2018-01-05',
  created_timestamp: '2018-06-06T15:37:32.000Z',
  created_by: {
    first_name: 'Name 3',
    last_name: 'LastName 3',
  },
  county: {
    name: 'Alameda',
  },
}

const getShallowWrapper = assessment => shallow(<ClientAssessmentHistoryRecord assessment={assessment} />)

describe('<ClientAssessmentHistory', () => {
  it('renders IN_PROGRESS assessment with all fields', () => {
    // given + when
    const wrapper = getShallowWrapper(assessmentInProgress)

    // then
    expect(wrapper.find('.locked-icon').length).toEqual(0)
    expect(wrapper.find('.unlocked-icon').length).toEqual(1)
    expect(
      wrapper
        .find(Link)
        .children()
        .text()
    ).toEqual('10/10/2015 CANS')
    const assessmentInfo = wrapper
      .find('.item-info')
      .get(0)
      .props.children.filter(el => el.type !== 'br')
    expect(assessmentInfo).toEqual([
      'Saved on 06/06/2015 by Name 1 LastName 1',
      'Case: 4444-333-4444-88888888',
      'County: Alameda',
    ])
  })

  it('renders SUBMITTED assessment with all fields', async () => {
    // given + when
    const wrapper = getShallowWrapper(assessmentSubmitted)

    // then
    expect(wrapper.find('.locked-icon').length).toEqual(1)
    expect(wrapper.find('.unlocked-icon').length).toEqual(0)
    expect(
      wrapper
        .find(Link)
        .children()
        .text()
    ).toEqual('01/05/2018 CANS')
    const timestamp = wrapper
      .find('.item-info')
      .get(0)
      .props.children.filter(el => el.type !== 'br')
    expect(timestamp).toEqual(['Submitted on 06/06/2018 by Name 2 LastName 2', 'Case: ', 'County: Alameda'])
  })

  it('renders assessment with no update info (create info only)', async () => {
    // given + when
    const wrapper = getShallowWrapper(assessmentWithNoUpdateInfo)

    // then
    const timestamp = wrapper
      .find('.item-info')
      .get(0)
      .props.children.filter(el => el.type !== 'br')
    expect(timestamp).toEqual(['Saved on 06/06/2018 by Name 3 LastName 3', 'Case: ', 'County: Alameda'])
  })
})
