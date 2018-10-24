import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'reactstrap'
import { SideNav } from './'
import { Client, ClientAddEditForm, ClientsContainer, ClientService } from '../Client'
import BreadCrumbsBuilder from './BreadCrumbsBuilder'
import { navigation } from '../../util/constants'
import { AssessmentContainer } from '../Assessment'
import { SearchContainer } from '../Search'
import { SupervisorDashboard } from '../Supervisor'
import Sticker from 'react-stickyfill'

class Page extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      client: undefined,
    }
  }

  async componentDidMount() {
    const client = await this.fetchClientIfNeeded()
    await this.setState({ client, isLoaded: true })
  }

  async componentDidUpdate(prevProps) {
    if (prevProps === this.props) return
    const client = await this.fetchClientIfNeeded()
    await this.setState({ client })
  }

  async fetchClientIfNeeded() {
    let client
    const { clientId } = this.props.match.params
    if (clientId) {
      client = await ClientService.fetch(clientId).catch(() => {})
    }
    return client
  }

  renderContent() {
    const params = {
      ...this.props,
      ...this.state,
    }
    switch (this.props.navigateTo) {
      case navigation.CHILD_LIST:
        return <ClientsContainer />
      case navigation.CHILD_PROFILE:
        return this.state.client && <Client {...params} />
      case navigation.CHILD_PROFILE_ADD:
        return <ClientAddEditForm isNewForm={true} {...params} />
      case navigation.CHILD_PROFILE_EDIT:
        return this.state.client && <ClientAddEditForm isNewForm={false} {...params} />
      case navigation.ASSESSMENT_ADD:
        return this.state.client && <AssessmentContainer isNewForm={true} {...params} />
      case navigation.ASSESSMENT_EDIT:
        return this.state.client && <AssessmentContainer isNewForm={false} {...params} />
      case navigation.CLIENT_SEARCH:
        return <SearchContainer />
      case navigation.STAFF_LIST:
        return <SupervisorDashboard />
      default:
        return null
    }
  }

  render() {
    if (!this.state.isLoaded) return null
    return (
      <Container>
        <BreadCrumbsBuilder navigateTo={this.props.navigateTo} client={this.state.client} />
        <Row>
          <Col xs="4">
            <Sticker>
              <SideNav />
            </Sticker>
          </Col>
          <Col xs="8" role={'main'} id={'main-content'}>
            <Row>
              <Col xs="12">{this.renderContent()}</Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

Page.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      clientId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  navigateTo: PropTypes.oneOf(Object.values(navigation)).isRequired,
}

Page.defaultProps = {
  history: {},
}

export default Page
