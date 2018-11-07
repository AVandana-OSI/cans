import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { apiGet } from '../../App.api'
import { selectPeopleResults } from '../../selectors/SearchSelectors'
import { systemCodes } from '../../enums/SystemCodes'
class Debouncer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
    }
  }

  getClients(searchTerm) {
    return apiGet(
      `/people_searches?search_term=${searchTerm}&is_client_only=true`
    ).then(response => {
      const clients = response.hits.hits
      const clientData = { results: clients, systemCodes }
      const results = selectPeopleResults(clientData)
      this.setState({ results })
    })
  }

  render() {
    const { results } = this.state
    return React.cloneElement(this.props.children, {
      debounce: searchTerm => {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.getClients(searchTerm)
        }, 400)
      },
      results,
    })
  }
}

Debouncer.propTypes = {
  //   children: PropTypes.Object.isRequired,
  //   callback: PropTypes.function.isRequired,
}

export default Debouncer
