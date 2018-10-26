import React from 'react'
import { shallow } from 'enzyme'
import AssessmentRecordInfo from './AssessmentRecordInfo'
import { assessmentInProgress, assessmentWithNoUpdateInfo } from '../Assessment/assessment.mocks.test'
import Typography from '@material-ui/core/Typography'

const prepareWrapper = assessment => shallow(<AssessmentRecordInfo assessment={assessment} />)

describe('AssessmentRecordInfo', () => {
  it('renders a Typography component with assessment info', () => {
    const wrapper = prepareWrapper(assessmentInProgress)
    const assessmentInfo = wrapper.children().map(child => child.props().children)

    expect(wrapper.length).toEqual(1)
    expect(wrapper.type()).toEqual(Typography)
    expect(assessmentInfo).toEqual([
      'Saved on 06/06/2015 by Name 1 Last_Name 1',
      'Case: 4444-333-4444-88888888',
      'County: Alameda',
    ])
  })

  it('renders a Typography component with no updated_by info (create info only)', () => {
    const wrapper = prepareWrapper(assessmentWithNoUpdateInfo)
    const assessmentInfo = wrapper.children().map(child => child.props().children)

    expect(wrapper.length).toEqual(1)
    expect(wrapper.type()).toEqual(Typography)
    expect(assessmentInfo).toEqual(['Saved on 06/06/2018 by Name 3 Last_Name 3', 'Case: ', 'County: Alameda'])
  })
})
