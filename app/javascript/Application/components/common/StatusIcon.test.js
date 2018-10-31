import { StatusIcon } from './StatusIcon'
import React from 'react'

describe('StatusIcon', () => {
  it('renders fa-spinner icon when status is IN_PROGRESS', () => {
    const expectedResult = StatusIcon({ status: 'IN_PROGRESS' })
    expect(expectedResult).toEqual(
      <div>
        <i className="fa fa-spinner fa-2x" aria-hidden="true" />
        <span className="text-style"> In Progress </span>
      </div>
    )
  })

  it('renders fa-check-circle icon when status is COMPLETED', () => {
    const expectedResult = StatusIcon({ status: 'COMPLETED' })
    expect(expectedResult).toEqual(
      <div>
        <i className="fa fa-check-circle-o fa-2x" aria-hidden="true" />
        <span className="text-style"> Complete </span>
      </div>
    )
  })
})
