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
    Header: 'In Progress',
    accessor: 'in_progress_count',
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
