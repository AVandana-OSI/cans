import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, CardBody } from '@cwds/components/lib/Cards'
import CardTitle from '@cwds/components/lib/Cards/CardTitle'
import Debouncer from './Debouncer'
import Autocompleter from './Autocompleter'

class PersonSearchForm extends PureComponent {
  render() {
    const { searchTitle, searchPrompt } = this.props

    return (
      <Card className="card hidden-print client-search-card">
        <CardHeader className="card-header-search">
          <CardTitle>{searchTitle}</CardTitle>
        </CardHeader>
        <CardBody className="card-body-search">
          <label className="pull-left" htmlFor="client-search-autocompleter">
            {searchPrompt}
          </label>
          <Debouncer>
            <Autocompleter id="client-search-autocompleter" />
          </Debouncer>
        </CardBody>
      </Card>
    )
  }
}

PersonSearchForm.propTypes = {
  searchPrompt: PropTypes.string.isRequired,
  searchTitle: PropTypes.string.isRequired,
}

export default PersonSearchForm
