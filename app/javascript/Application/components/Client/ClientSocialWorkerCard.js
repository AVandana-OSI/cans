import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, CardBody } from '@cwds/components/lib/Cards'
import CardTitle from '@cwds/components/lib/Cards/CardTitle'
import DataGrid from '@cwds/components/lib/DataGrid'
import './style.sass'

const ClientSocialWorkerCard = props => {
  return (
    <Card className="card-cans-client-list">
      <CardHeader>
        <CardTitle tag="h4">
          Client List<span className="client-list-records-amount">({props.title})</span>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <DataGrid
          {...props}
          sortable={true}
          className="client-grid"
          minRows={2}
          noDataText={'No records found'}
          pageSizeOptions={[10, 25, 50]}
          showPaginationBottom={true}
        />
      </CardBody>
    </Card>
  )
}

ClientSocialWorkerCard.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.number.isRequired,
}

export default ClientSocialWorkerCard
