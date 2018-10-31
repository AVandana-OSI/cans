import React from 'react'
import PropTypes from 'prop-types'
import Autocompleter from '../common/search/Autocompleter'
import { Card, CardHeader, CardBody } from '@cwds/components/lib/Cards'
import CardTitle from '@cwds/components/lib/Cards/CardTitle'

class PersonSearchForm extends React.Component {
  render() {
    const { searchPrompt } = this.props

    return (
      <div>
        <div className="card double-gap-bottom hidden-print" id="search-card">
          <div className="card-header">
            <h2>Search Clients Only</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <label
                  className="pull-left"
                  htmlFor="client-search-autocompleter"
                >
                  {searchPrompt}
                </label>
                <Autocompleter id="client-search-autocompleter" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

PersonSearchForm.defaultProps = {
  // location: PropTypes.shape({
  //   pathname: PropTypes.string,
  // }),
  // onLoadMoreResults: PropTypes.func,
  // searchCounty: PropTypes.string,
}

PersonSearchForm.propTypes = {
  // location: PropTypes.shape({
  //   pathname: PropTypes.string,
  // }),
  // onLoadMoreResults: PropTypes.func,
  // searchCounty: PropTypes.string,
  searchPrompt: PropTypes.string.isRequired,
}

export default PersonSearchForm
