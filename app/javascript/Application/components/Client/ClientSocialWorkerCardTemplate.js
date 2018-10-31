import { formatClientName, formatClientStatus } from './Client.helper'
import { isoToLocalDate } from '../../util/dateHelper'
import ClientCardTemplateNameCell from './ClientCardTemplateNameCell'
import './style.sass'

export function SocialWorkerCardTemplate(client) {
  function renderDate(datetime) {
    return !datetime || datetime === null ? null : isoToLocalDate(datetime)
  }
  const template = [
    {
      id: 'fullName',
      Header: 'Client Name',
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
      },
      accessor: client => renderDate(client.dob),
      className: 'client-list-table-cell-center',
      sortable: false,
    },
    {
      id: 'CANS Status',
      Header: 'CANS Status',
      headerStyle: {
        textAlign: 'center',
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
      },
      accessor: client => {
        return renderDate(client.reminder_date)
      },
      className: 'client-list-table-cell-center',
      sortable: false,
    },
  ]
  return template
}
