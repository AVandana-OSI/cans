import React from 'react'
import PropTypes from 'prop-types'
import DataGrid from '@cwds/components/lib/DataGrid'
import { staffPropType } from './StaffHelper'

const columns = [
  {
    Header: 'Staff Name',
    id: 'staffName',
    accessor: staff => `${staff.staff_person.last_name}, ${staff.staff_person.first_name}`,
  },
  {
    Header: 'Total Clients',
    accessor: 'clients_count',
    className: 'text-center',
    headerClassName: 'text-center',
  },
  {
    Header: 'No Prior',
    accessor: 'no_prior_cans_count',
    className: 'text-center',
    headerClassName: 'text-center',
  },
  {
    Header: 'In Progress',
    accessor: 'in_progress_count',
    className: 'text-center',
    headerClassName: 'text-center',
  },
  {
    Header: 'Completed',
    accessor: 'completed_count',
    className: 'text-center',
    headerClassName: 'text-center',
  },
]

const StaffTable = ({ staff }) => (
  <DataGrid
    data={staff}
    columns={columns}
    showPagination={false}
    defaultPageSize={1000}
    minRows={3}
    defaultSorted={[{ id: 'staffName' }]}
  />
)

StaffTable.propTypes = {
  staff: PropTypes.arrayOf(staffPropType).isRequired,
}

export default StaffTable
