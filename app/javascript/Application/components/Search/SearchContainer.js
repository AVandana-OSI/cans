import React, { Component } from 'react'
import ClientService from '../Client/Client.service'
import { LoadingState } from '../../util/loadingHelper'
import SearchAssessmentHistory from './SearchAssessmentHistory'
import './style.sass'

const calculatePages = (recordsCount, pageSize) => Math.ceil(recordsCount / pageSize)

const initialFilterState = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
}

const assessmentHistoryTitle = 'Assessment History'

class SearchContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: initialFilterState,
      pagination: {
        page: 0,
        pages: 0,
        pageSize: 10,
      },
      records: [],
    }
  }

  async componentDidMount() {
    await this.fetchClients()
  }

  fetchClients = () => {
    return ClientService.search({ ...this.state.filter, pagination: this.state.pagination })
      .then(this.onFetchClientsSuccess)
      .catch(error => {
        console.log(error)
      })
  }

  onFetchClientsSuccess = searchResult => {
    const pagination = this.state.pagination
    const pages = calculatePages(searchResult.total_records, pagination.pageSize)
    this.setState({
      pagination: {
        ...pagination,
        pages,
      },
      records: searchResult.records,
    })
  }

  renderAccessRestrictions = client =>
    client.sensitivity_type === 'SENSITIVE' ? 'Sensitive' : client.sensitivity_type === 'SEALED' ? 'Sealed' : null

  renderSearchAssessmentHistory(clientIds) {
    return <SearchAssessmentHistory clientIds={clientIds} numAssessments={3} historyTitle={assessmentHistoryTitle} />
  }

  getClientIdsFromRecords(records) {
    return records.map(record => {
      return record.id
    })
  }

  render = () => {
    const { records } = this.state
    const clientIds = this.getClientIdsFromRecords(records)
    return <div className="client-search-container">{this.renderSearchAssessmentHistory(clientIds)}</div>
  }
}

export default SearchContainer
