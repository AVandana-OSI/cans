import React, { Component } from 'react'
import ClientService from '../Client/Client.service'
import SearchAssessmentHistory from './SearchAssessmentHistory'
import { LoadingState } from '../../util/loadingHelper'
import './style.sass'

const calculatePages = (recordsCount, pageSize) => {
  return Math.ceil(recordsCount / pageSize)
}

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
      numAssessments: 3,
      clientsStatus: LoadingState.ready,
    }
  }

  async componentDidMount() {
    await this.fetchClients()
  }

  fetchClients = () => {
    this.setState({ clientsStatus: LoadingState.waiting })
    return ClientService.search({
      ...this.state.filter,
      pagination: this.state.pagination,
    })
      .then(this.onFetchClientsSuccess)
      .catch(() => this.setState({ clientsStatus: LoadingState.error }))
  }

  onFetchClientsSuccess = searchResult => {
    const pagination = this.state.pagination
    const pages = calculatePages(
      searchResult.total_records,
      pagination.pageSize
    )

    this.setState({
      pagination: {
        ...pagination,
        pages,
      },
      records: searchResult.records,
      clientsStatus: LoadingState.ready,
    })
  }

  renderSearchAssessmentHistory(numAssessments, clientIds) {
    return (
      <SearchAssessmentHistory
        clientIds={clientIds}
        numAssessments={numAssessments}
        historyTitle={assessmentHistoryTitle}
      />
    )
  }

  getClientIdsFromRecords(records) {
    return records.map(record => {
      return record.id
    })
  }

  render = () => {
    const { records, numAssessments, clientsStatus } = this.state
    const clientIds = records ? this.getClientIdsFromRecords(records) : []
    return (
      <div className="client-search-container">
        {this.renderSearchAssessmentHistory(numAssessments, clientIds)}
      </div>
    )
  }
}

export default SearchContainer
