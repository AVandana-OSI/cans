import React, { Fragment } from 'react'
import Button from '@cwds/components/lib/Button'

/**
 * Replacing PagerButtonFactory from @cwds/components library to solve
 * IE11 tabbing issue: @cwds/Icon component is focused inside the button
 * while user tabs through elements, that is not a desired behavior
 */
// eslint-disable-next-line react/display-name
const PaginationButtonFactory = ({ direction }) => props => {
  const { children, ...rest } = props
  return (
    <Fragment>
      <span className="sr-only">{children}</span>
      <Button {...rest} color="info" aria-label={children}>
        <i aria-hidden="true" className={`fa fa-chevron-${direction}`} />
      </Button>
    </Fragment>
  )
}

export default PaginationButtonFactory
