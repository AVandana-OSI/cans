import PropTypes from 'prop-types'
import React from 'react'

import './style.sass'

const SuggestionHeader = ({ currentNumberOfResults, total, searchTerm }) => {
  const oneResult = 1
  const noResults = total < oneResult
  if (total === null) {
    return null
  }
  return (
    <div className="autocompleter-suggestion-header">
      <strong>
        {noResults
          ? `No results were found for "${searchTerm}"`
          : `Showing 1-${currentNumberOfResults} of ${total} results for "${searchTerm}"`}
      </strong>
    </div>
  )
}
SuggestionHeader.defaultProps = {
  currentNumberOfResults: 0,
  searchTerm: '',
  total: 0,
}
SuggestionHeader.propTypes = {
  currentNumberOfResults: PropTypes.number,
  searchTerm: PropTypes.string,
  total: PropTypes.number,
}
export default SuggestionHeader
