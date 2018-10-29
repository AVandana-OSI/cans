import { isoToLocalDate } from '../../util/dateHelper'
import { formatClientName, formatClientStatus } from './Client.helper'
import React from 'react'
import './style.sass'
import { Link } from 'react-router-dom'
class SocialWorkerCardTemplate extends React.Component {
  static whiteFourCols = client => {
    const template = [
      {
        id: 'fullName',
        Header: 'Client Name',
        headerStyle: {
          fontSize: '1.3rem',
        },
        accessor: client => {
          return formatClientName(client)
        },
        Cell: data => {
          return (
            <Link id="linkedFullName" key={data.original.id} to={`/clients/${data.original.id}`}>
              {data.value}
            </Link>
          )
        },
      },
      {
        id: 'dob',
        Header: 'DOB',
        headerStyle: {
          textAlign: 'center',
          fontSize: '1.3rem',
        },
        accessor: client => isoToLocalDate(client.dob),
        className: 'client-list-table-cell-center',
        sortable: false,
      },
      {
        id: 'CANS Status',
        Header: 'CANS Status',
        headerStyle: {
          textAlign: 'center',
          fontSize: '1.3rem',
        },
        accessor: client => {
          return formatClientStatus(client.status)
        },
        className: 'client-list-table-cell-center',
        sortable: false,
      },
      {
        id: 'Reminder Date',
        Header: 'Reminder Date',
        headerStyle: {
          textAlign: 'center',
          fontSize: '1.3rem',
        },
        accessor: client => {
          return isoToLocalDate(client.reminder_date)
        },
        className: 'client-list-table-cell-center',
        sortable: false,
      },
    ]

    return template
  }
}

export default SocialWorkerCardTemplate
