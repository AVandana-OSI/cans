import { isoToLocalDate } from '../../util/dateHelper'
import { formatClientName, formatClientStatus } from './Client.helper'
import ClientCardTemplateNameCell from './ClientCardTemplateNameCell'
import './style.sass'

const SocialWorkerCardTemplate = client => {
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
      Cell: ClientCardTemplateNameCell,
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

export default SocialWorkerCardTemplate
