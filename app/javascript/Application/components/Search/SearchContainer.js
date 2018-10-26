import React, { Component } from 'react'
import GetClients from '../Client/Client.service'
import SearchAssessmentHistory from './SearchAssessmentHistory'
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
    }
  }

  async componentDidMount() {
    await this.fetchClients()
  }

  fetchClients = () => {
    return GetClients.search({ ...this.state.filter, pagination: this.state.pagination })
      .then(this.onFetchClientsSuccess)
      .catch(err => {
        throw err
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
    return records.map(record => record.id)
  }

  render = () => {
    const { records, numAssessments } = this.state
    const clientIds = records ? this.getClientIdsFromRecords(records) : []
    return (
      <div className="client-search-container">{this.renderSearchAssessmentHistory(numAssessments, clientIds)}</div>
    )
  }
}

export default SearchContainer
