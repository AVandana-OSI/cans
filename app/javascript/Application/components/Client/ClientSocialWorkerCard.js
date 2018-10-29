import React from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import DataGrid from '@cwds/components/lib/DataGrid'
import './style.sass'

const ClientSocialWorkerCard = props => {
  return (
    <Card className={'card-cans-client-list'}>
      <CardHeader className={'card-header-cans-client-list'} title={props.title} />
      <div>
        <CardContent>
          <DataGrid
            {...props}
            sortable={true}
            className="client-grid"
            minRows={2}
            noDataText={'No records found'}
            pageSizeOptions={[10, 25, 50]}
            showPaginationBottom={true}
          />
        </CardContent>
      </div>
    </Card>
  )
}

ClientSocialWorkerCard.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.object.isRequired,
}

export default ClientSocialWorkerCard
