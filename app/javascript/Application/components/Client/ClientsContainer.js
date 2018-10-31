import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Label, Input, Button as ButtonReactStrap } from 'reactstrap'
import ClientService from './Client.service'
import PaginationButtonFactory from '../common/pagination/PaginationButtonFactory'
import Pagination from '../common/pagination/Pagination'
import DateField from '../common/DateField'
import { formatClientName } from './Client.helper'
import { isoToLocalDate } from '../../util/dateHelper'
import { LoadingState } from '../../util/loadingHelper'
import { isEnterKeyPressed } from '../../util/events'
import Button from '@material-ui/core/Button/Button'
import Card from '@material-ui/core/Card/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import DataGrid from '@cwds/components/lib/DataGrid'

import './style.sass'

const calculatePages = (recordsCount, pageSize) => Math.ceil(recordsCount / pageSize)

const initialFilterState = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
}

class ClientsContainer extends Component {
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
      clientsStatus: LoadingState.ready,
    }
    this.handleOnPageSizeChange = this.handleOnPageSizeChange.bind(this)
    this.handleOnPageChange = this.handleOnPageChange.bind(this)
    this.handleResetButtonClick = this.handleResetButtonClick.bind(this)
  }

  async componentDidMount() {
    await this.fetchClients()
  }

  fetchClients = () => {
    this.setState({ clientsStatus: LoadingState.waiting })
    return ClientService.search({ ...this.state.filter, pagination: this.state.pagination })
      .then(this.onFetchClientsSuccess)
      .catch(() => this.setState({ clientsStatus: LoadingState.error }))
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
      clientsStatus: LoadingState.ready,
    })
  }

  resetPagination = () => ({
    ...this.state.pagination,
    page: 0,
  })

  async handleOnPageChange(page) {
    const pagination = this.state.pagination
    await this.setState({
      pagination: {
        ...pagination,
        page,
      },
    })
    await this.fetchClients()
  }

  async handleOnPageSizeChange(pageSize) {
    await this.setState({
      pagination: {
        ...this.resetPagination(),
        pageSize,
      },
    })
    await this.fetchClients()
  }

  async handleResetButtonClick() {
    await this.setState({
      filter: initialFilterState,
      pagination: this.resetPagination(),
    })
    this.fetchClients()
  }

  handleFilterInputChange = filterName => event =>
    this.setState({
      filter: {
        ...this.state.filter,
        [filterName]: event.target.value,
      },
      pagination: this.resetPagination(),
    })

  handleFilterInputKeyPress = event => {
    if (isEnterKeyPressed(event)) {
      this.fetchClients()
    }
  }

  handleDateFilterInputChange = filterName => value => {
    this.setState({
      filter: {
        ...this.state.filter,
        [filterName]: value,
      },
      pagination: this.resetPagination(),
    })
  }

  renderDateFilterInput(filterName, label) {
    const inputId = `${filterName}-input`
    const labelId = `${inputId}-label`
    return (
      <Fragment>
        <Label id={labelId} for={inputId} className={'filter-controls-label'}>
          {label}
        </Label>
        <DateField
          required={true}
          id={inputId}
          value={this.state.filter[filterName]}
          onChange={this.handleDateFilterInputChange(filterName)}
          ariaLabelledBy={labelId}
        />
      </Fragment>
    )
  }

  renderFilterInput(filterName, label) {
    const inputId = `${filterName}-input`
    return (
      <Fragment>
        <Label for={inputId} className={'filter-controls-label'}>
          {label}
        </Label>
        <Input
          id={inputId}
          value={this.state.filter[filterName]}
          onChange={this.handleFilterInputChange(filterName)}
          onKeyPress={this.handleFilterInputKeyPress}
          style={{ fontSize: '1.5rem', height: '3.6rem' }}
        />
      </Fragment>
    )
  }

  renderFilterControls = () => {
    return (
      <div className={'filter-controls'}>
        <Row>
          <Col sm={4}>{this.renderFilterInput('firstName', 'First Name')}</Col>
          <Col sm={4}>{this.renderFilterInput('middleName', 'Middle Name')}</Col>
          <Col sm={4}>{this.renderFilterInput('lastName', 'Last Name')}</Col>
        </Row>
        <Row>
          <Col sm={4}>{this.renderDateFilterInput('dob', 'Date of Birth')}</Col>
        </Row>
        <Row>
          <Col sm={12}>
            <div className={'filter-buttons'}>
              <ButtonReactStrap id={'search-button'} color={'primary'} onClick={this.fetchClients}>
                Search
              </ButtonReactStrap>
              <ButtonReactStrap
                id={'reset-filter'}
                color={'link'}
                className={'cancel-button-darker'}
                onClick={this.handleResetButtonClick}
              >
                Reset
              </ButtonReactStrap>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  renderAddChildButton() {
    return (
      <Link to={'/clients/new'}>
        <Button size="small" color="inherit" className={'card-header-cans-button'}>
          Add Child
        </Button>
      </Link>
    )
  }

  renderClientName = client => {
    const name = formatClientName(client)
    const isEditable = client.metadata && client.metadata.editable
    if (isEditable) {
      return (
        <Link key={client.identifier} className="client-name" to={`/clients/${client.identifier}`}>
          {formatClientName(client)}
        </Link>
      )
    } else {
      return (
        <div className="sensitive-client-name" key={client.identifier}>
          {name}
        </div>
      )
    }
  }

  renderClientDob = client => isoToLocalDate(client.dob)

  renderAccessRestrictions = client =>
    client.sensitivity_type === 'SENSITIVE' ? 'Sensitive' : client.sensitivity_type === 'SEALED' ? 'Sealed' : null

  render = () => {
    const { records, pagination, clientsStatus } = this.state
    const { page, pages, pageSize } = pagination
    const columns = [
      {
        id: 'fullName',
        Header: 'Full Name',
        accessor: this.renderClientName,
        sortable: false,
      },
      {
        id: 'dob',
        Header: 'Date of Birth',
        accessor: this.renderClientDob,
        sortable: false,
      },
      {
        id: 'sensitivity',
        Header: 'Access Restrictions',
        accessor: this.renderAccessRestrictions,
        sortable: false,
      },
    ]
    const isPaginationShown = records.length > 0
    const loading = clientsStatus === LoadingState.waiting
    return (
      <Card className={'card'}>
        <CardHeader className={'card-header-cans'} title="County Client List" action={this.renderAddChildButton()} />
        <div className={'content'}>
          <CardContent>
            {this.renderFilterControls()}
            <DataGrid
              manual
              data={records}
              page={page}
              pages={pages}
              pageSize={pageSize}
              columns={columns}
              pageSizeOptions={[10, 25, 50, 100]}
              showPaginationTop={isPaginationShown}
              showPaginationBottom={isPaginationShown}
              PreviousComponent={PaginationButtonFactory({ direction: 'left' })}
              NextComponent={PaginationButtonFactory({ direction: 'right' })}
              PaginationComponent={Pagination}
              minRows={2}
              loading={loading}
              noDataText={'No records found'}
              onPageChange={this.handleOnPageChange}
              onPageSizeChange={this.handleOnPageSizeChange}
            />
          </CardContent>
        </div>
      </Card>
    )
  }
}

export default ClientsContainer
