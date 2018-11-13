import React, { Component } from 'react'
import PropTypes from 'prop-types'

const NUM_RESULTS_PER_PAGE = 10

class SearchPagination extends Component {
  constructor(props) {
    super(props)

    this.totalPages = this.calculateTotalPages(this.props.totalResults, NUM_RESULTS_PER_PAGE)

    this.state = {
      pagination: {
        currentPage: this.props.totalResults > 0 ? 1 : 0,
        totalPages: this.totalPages,
      },
    }

    this.getPrevPage = this.getPrevPage.bind(this)
    this.getNextPage = this.getNextPage.bind(this)
  }
  calculateTotalPages(totalResults, numResultsPerPage) {
    const totalPages =
      totalResults % numResultsPerPage === 0
        ? totalResults / numResultsPerPage
        : Math.floor(totalResults / numResultsPerPage) + 1

    return totalPages
  }
  getPrevPage() {
    const { pagination } = this.state
    const { currentPage, totalPages } = pagination
    const newPage = currentPage - 1 < 1 ? currentPage : currentPage - 1

    if (newPage !== currentPage) {
      this.setState({ pagination: { currentPage: newPage, totalPages } })
    }
  }
  getNextPage() {
    const { pagination } = this.state
    const { currentPage, totalPages } = pagination
    const newPage = currentPage + 1 > totalPages ? currentPage : currentPage + 1

    if (newPage !== currentPage) {
      this.setState({ pagination: { currentPage: newPage, totalPages } })
    }
  }
  render() {
    const { pagination } = this.state
    const { currentPage, totalPages } = pagination
    const { disable } = this.props

    return totalPages > 0 ? (
      <div className="suggestion-footer">
        <div className="pagination-wrapper">
          <button
            className="prev-page"
            aria-label="Previous"
            onClick={this.getPrevPage}
            disabled={Boolean(currentPage <= 1 || disable)}
          >
            <i className="fa fa-caret-left" />
          </button>
          <input className="current-page-number" disabled={disable} readOnly={true} type="text" value={currentPage} />
          <div className="total-pages-wrapper">
            of <span className="total-pages">{totalPages}</span>
          </div>
          <button
            className="next-page"
            aria-label="Next"
            onClick={this.getNextPage}
            disabled={Boolean(currentPage === totalPages || disable)}
          >
            <i className="fa fa-caret-right" />
          </button>
        </div>
      </div>
    ) : null
  }
}

SearchPagination.propTypes = {
  changePage: PropTypes.func.isRequired,
  disable: PropTypes.bool.isRequired,
  totalResults: PropTypes.number.isRequired,
}

export default SearchPagination
