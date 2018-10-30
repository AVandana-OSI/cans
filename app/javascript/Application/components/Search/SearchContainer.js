import React, { Component } from 'react'
import SearchAssessmentHistory from './SearchAssessmentHistory'
import './style.sass'

class SearchContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      numAssessments: 3,
    }
  }

  renderSearchAssessmentHistory(numAssessments) {
    return <SearchAssessmentHistory numAssessments={numAssessments} />
  }

  render = () => {
    const { numAssessments } = this.state

    return <div className="client-search-container">{this.renderSearchAssessmentHistory(numAssessments)}</div>
  }
}

export default SearchContainer
