import React from 'react'
import { Link } from 'react-router-dom'
import { shallow } from 'enzyme'
import AssessmentLink from './AssessmentLink'
import { assessmentInProgress } from '../Assessment/assessment.mocks.test'
import { isoToLocalDate } from '../../util/dateHelper'

describe('AssessmentRecordIcon', () => {
  const prepareWrapper = assessment => {
    return shallow(<AssessmentLink assessment={assessment} />)
  }

  it('renders a Link component', () => {
    const wrapper = prepareWrapper(assessmentInProgress)

    expect(wrapper.type()).toEqual(Link)
  })

  it('renders one Link component', () => {
    const wrapper = prepareWrapper(assessmentInProgress)

    expect(wrapper.length).toEqual(1)
  })

  it('the "to" property includes the person id and the assessment id', () => {
    const { id, person } = assessmentInProgress
    const wrapper = prepareWrapper(assessmentInProgress)

    expect(wrapper.props().to).toEqual(`/clients/${person.id}/assessments/${id}`)
  })

  it('the Link text is the formatted date + " CANS ', () => {
    const { event_date: eventDate } = assessmentInProgress
    const formattedEventDate = isoToLocalDate(eventDate)
    const wrapper = prepareWrapper(assessmentInProgress)
    const linkText = wrapper.props().children

    expect(linkText).toEqual(`${formattedEventDate} CANS`)
  })
})
