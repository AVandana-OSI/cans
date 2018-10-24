import React from 'react'
import { shallow } from 'enzyme'
import SubordinateCard from './SubordinateCard'
import SubordinateLoadingBoundary from './SubordinateLoadingBoundary'
import SupervisorDashboard from './SupervisorDashboard'

describe('<SupervisorDashboard />', () => {
  const render = () => shallow(<SupervisorDashboard />)

  it('renders a SubordinateCard within a SubordinateLoadingBoundary', () => {
    const wrapper = render()
    expect(
      wrapper
        .find(SubordinateLoadingBoundary)
        .find(SubordinateCard)
        .exists()
    ).toBe(true)
  })
})
