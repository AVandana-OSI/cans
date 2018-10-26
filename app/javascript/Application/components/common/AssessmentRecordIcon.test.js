import React from 'react'
import { shallow } from 'enzyme'
import AssessmentRecordIcon from './AssessmentRecordIcon'
import { AssessmentStatus } from '../Assessment/AssessmentHelper'

describe('AssessmentRecordIcon', () => {
  const prepareWrapper = status => {
    return shallow(<AssessmentRecordIcon status={status} />)
  }

  it('renders the in progress icon', () => {
    const wrapper = prepareWrapper(AssessmentStatus.inProgress)

    expect(wrapper.find('i.fa-spinner').length).toEqual(1)
    expect(wrapper.find('i.fa-check-circle-o').length).toEqual(0)
  })

  it('renders the complete icon', () => {
    const wrapper = prepareWrapper(AssessmentStatus.completed)

    expect(wrapper.find('i.fa-spinner').length).toEqual(0)
    expect(wrapper.find('i.fa-check-circle-o').length).toEqual(1)
  })

  it('renders null', () => {
    const wrapper = prepareWrapper('')

    expect(wrapper.find('i.fa-spinner').length).toEqual(0)
    expect(wrapper.find('i.fa-check-circle-o').length).toEqual(0)
  })
})
