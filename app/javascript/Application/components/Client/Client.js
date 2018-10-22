import React, { Component, Fragment } from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import PropTypes from 'prop-types'
import { PageInfo } from '../Layout'
import Button from '@material-ui/core/Button/Button'
import ClientAssessmentHistory from './ClientAssessmentHistory'
import { CloseableAlert, alertType } from '../common/CloseableAlert'
import { Link } from 'react-router-dom'
import { isoToLocalDate } from '../../util/dateHelper'

import './style.sass'

class Client extends Component {
  constructor(props) {
    super(props)
    const { isNewForm, successClientId } = (this.props.location || {}).state || {}
    if (successClientId && this.props.history) {
      this.props.history.replace({ ...this.props.location, state: {} })
    }
    this.state = {
      isNewForm,
      shouldRenderClientMessage: !!successClientId,
    }
  }

  renderClientData(data, label, gridSize = 3) {
    return (
      <Grid item xs={gridSize}>
        <div className={'label-text'}>{label}</div>
        {data}
      </Grid>
    )
  }

  formatClientId = num => {
    if (num) {
      if (num.length === 19) {
        const firstFour = num.substring(0, 4)
        const secondFour = num.substring(4, 8)
        const thirdFour = num.substring(8, 12)
        const fourthFour = num.substring(12, 19)
        return `${firstFour}-${secondFour}-${thirdFour}-${fourthFour}`
      } else if (num.length === 22) {
        return num
      } else {
        return '0'
      }
    }
  }

  formatCases(cases) {
    if (!cases) return null
    const items = [...cases].reverse().map(aCase => {
      return <li key={aCase.external_id}>{aCase.external_id}</li>
    })
    return <ul className={'no-indent-list'}>{items}</ul>
  }

  sensitivityTypeLabel(type) {
    if (!type) {
      return 'Unrestricted'
    }
    switch (type) {
      case 'SEALED':
        return 'Sealed'
      case 'SENSITIVE':
        return 'Sensitive'
      default:
        return type
    }
  }

  render() {
    const { client } = this.props
    const { isNewForm, shouldRenderClientMessage } = this.state
    return (
      <Fragment>
        <PageInfo title={'Child/Youth Profile'} />
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Card className={'card'}>
              <CardHeader
                className={'card-header-cans'}
                title="Child/Youth Information"
                action={
                  <Link to={`/clients/${client.id}/edit`}>
                    <Button size="small" color="inherit" className={'card-header-cans-button'}>
                      EDIT
                    </Button>
                  </Link>
                }
              />
              <div className={'content'}>
                <CardContent>
                  {shouldRenderClientMessage && (
                    <CloseableAlert
                      type={alertType.SUCCESS}
                      message={
                        isNewForm
                          ? 'Success! New Child/Youth record has been added.'
                          : 'Success! Child/Youth record has been updated.'
                      }
                      isCloseable
                      isAutoCloseable
                    />
                  )}

                  {client && client.id ? (
                    <Grid container spacing={24} id={'client-info-content'}>
                      {this.renderClientData(client.first_name, 'First Name')}
                      {this.renderClientData(client.middle_name, 'Middle Name')}
                      {this.renderClientData(client.last_name, 'Last Name')}
                      {this.renderClientData(client.suffix, 'Suffix')}
                      {this.renderClientData(isoToLocalDate(client.dob), 'Date of Birth')}
                      {this.renderClientData(client.county.name, 'County')}
                      {this.renderClientData(this.formatClientId(client.external_id), 'Client Id', 6)}
                      {this.renderClientData(
                        this.sensitivityTypeLabel(client.sensitivity_type),
                        'Access Restrictions',
                        6
                      )}
                      {this.renderClientData(
                        this.formatCases(client.cases),
                        client.cases.length > 1 ? 'Case Numbers' : 'Case Number',
                        6
                      )}
                    </Grid>
                  ) : (
                    <span id={'no-data'}>No Child Data Found</span>
                  )}
                </CardContent>
              </div>
            </Card>
          </Grid>
          <ClientAssessmentHistory clientId={client.id} location={this.props.location} history={this.props.history} />
        </Grid>
      </Fragment>
    )
  }
}

Client.propTypes = {
  client: PropTypes.object,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

Client.defaultProps = {
  client: {},
}

export default Client
