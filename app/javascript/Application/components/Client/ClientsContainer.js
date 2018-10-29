import React, { Component } from 'react'
import './style.sass'
import ClientSocialWorkerCard from './ClientSocialWorkerCard'
import ClientService from './Client.service'
import UserAccountService from '../common/UserAccountService'
import socialWorkerCardTemplate from './ClientSocialWorkerCardTemplate'
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
    }
  }

  render = () => {
    const { records, dataStatus, recordsAmount } = this.state

    const title = (
      <span>
        Client List
        <span className="client-list-records-amount">({recordsAmount})</span>
      </span>
    )
    const template = socialWorkerCardTemplate.whiteFourCols()
    const loading = dataStatus === LoadingState.waiting

    const defaultSortSetting = [
      {
        id: 'fullName',
        asc: true,
      },
    ]
    return (
      <ClientSocialWorkerCard
        title={title}
        data={records}
        columns={template}
        defaultSorted={defaultSortSetting}
        loading={loading}
      />
    )
  }
}

export default ClientsContainer
