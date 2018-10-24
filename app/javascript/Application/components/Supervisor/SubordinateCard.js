import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, CardBody } from '@cwds/components/lib/Cards'
import CardTitle from '@cwds/components/lib/Cards/CardTitle'
import StaffTable from './StaffTable'
import { LoadingState } from '../../util/loadingHelper'
import { staffPropType } from './StaffHelper'
import './style.sass'

const SubordinateCard = ({ loadingState, staff }) => {
  const loadingProp = loadingState === LoadingState.updating ? true : undefined
  return (
    <Card className={'card supervisor-card'} loading={loadingProp}>
      <CardHeader>
        <CardTitle>Assigned Staff</CardTitle>
      </CardHeader>
      <CardBody>
        <StaffTable staff={staff} />
      </CardBody>
    </Card>
  )
}

SubordinateCard.propTypes = {
  loadingState: PropTypes.oneOf(Object.values(LoadingState)),
  staff: PropTypes.arrayOf(staffPropType),
}

SubordinateCard.defaultProps = {
  loadingState: LoadingState.updating,
  staff: [],
}

export default SubordinateCard
