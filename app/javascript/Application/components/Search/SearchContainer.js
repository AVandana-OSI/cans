import React from 'react'
import PersonSearchForm from './PersonSearchForm'
import SearchAssessmentHistory from './SearchAssessmentHistory'
import './style.sass'

const SEARCH_PROMPT = 'Search CWS-CMS for clients only'
const SEARCH_TITLE = 'Search Clients Only'
const NUM_ASSESSMENTS = 3

const SearchContainer = () => (
  <div className="client-search-container">
    <PersonSearchForm searchPrompt={SEARCH_PROMPT} />
    <SearchAssessmentHistory numAssessments={NUM_ASSESSMENTS} />
  </div>
)

export default SearchContainer
