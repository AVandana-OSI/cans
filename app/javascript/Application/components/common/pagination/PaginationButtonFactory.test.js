import React from 'react'
import PaginationButtonFactory from './PaginationButtonFactory'
import { shallow } from 'enzyme'

describe('<PaginationButtonFactory />', () => {
  const LeftPaginationButton = PaginationButtonFactory({ direction: 'left' })
  const RightPaginationButton = PaginationButtonFactory({ direction: 'right' })

  it('should render button with left chevron icon', () => {
    const leftButton = shallow(<LeftPaginationButton />)
    expect(leftButton.find('.fa-chevron-left').length).toBe(1)
  })

  it('should render button with right chevron icon', () => {
    const leftButton = shallow(<RightPaginationButton />)
    expect(leftButton.find('.fa-chevron-right').length).toBe(1)
  })
})
