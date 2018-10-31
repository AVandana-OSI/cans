import React, { Component } from 'react'
import './style.sass'
import ClientSocialWorkerCard from './ClientSocialWorkerCard'
import ClientService from './Client.service'
import UserAccountService from '../common/UserAccountService'
import { SocialWorkerCardTemplate } from './ClientSocialWorkerCardTemplate'
import { LoadingState } from '../../util/loadingHelper'
import { handleError } from '../../util/ApiErrorHandler'
import { failedFetching } from './Client.helper'

const initialState = {
  records: [],
  recordsAmount: 0,
  dataStatus: LoadingState.waiting,
}

class ClientsContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...initialState,
    }
  }

  async componentDidMount() {
    const userAccountInfo = await UserAccountService.fetchCurrent()
    const records = await ClientService.socialWorkerClient(userAccountInfo.staff_id)
    this.ClientRecordsChk(records)
  }

<<<<<<< HEAD
  ClientRecordsChk = records => {
    if (!Array.isArray(records)) {
      this.setState({ ...initialState, dataStatus: LoadingState.error })
      handleError(failedFetching)
    } else {
      this.setState({
        records,
        recordsAmount: records.length,
        dataStatus: LoadingState.ready,
      })
=======
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
>>>>>>> a7da053da072264c8cd019ffc577ed1cfe5e4846
    }
  }

  render = () => {
    const { records, dataStatus, recordsAmount } = this.state
    const template = SocialWorkerCardTemplate()
    const loading = dataStatus === LoadingState.waiting

    const defaultSortSetting = [
      {
        id: 'fullName',
        asc: true,
      },
    ]
    return (
      <ClientSocialWorkerCard
        title={recordsAmount}
        data={records}
        columns={template}
        defaultSorted={defaultSortSetting}
        loading={loading}
      />
    )
  }
}

export default ClientsContainer
