import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InputMask from 'react-input-mask'
import { Row, Col, Button } from 'reactstrap'
import { TextField, Card, CardHeader, CardContent } from '@material-ui/core'
import { Redirect } from 'react-router-dom'
import { CountiesService } from './Counties.service'
import { SensitivityTypesService } from './SensitivityTypes.service'
import { CloseableAlert, alertType } from '../common/CloseableAlert'
import UserAccountService from '../Header/UserAccountService'
import { ClientService } from './Client.service'
import { validate, validateCase, validateCaseNumbersAreUnique, isFormValid } from './ClientFormValidator'
import { PageInfo } from '../Layout'
import { isA11yAllowedInput } from '../../util/events'
import { clone, stringify } from '../../util/common'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import MaskedDateField from '../common/MaskedDateField'
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles'

import './style.sass'

const FIRST_MIDDLE_NAME_MAX_LENGTH = 20
const LAST_NAME_MAX_LENGTH = 25
const SUFFIX_MAX_LENGTH = 4

const theme = createMuiTheme({
  palette: {
    error: {
      main: '#DA190B',
    },
  },
})

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    width: 300,
    margin: 10,
  },
  inputSelect: {
    backgroundImage: 'none !important',
    color: '#111',
    fontSize: 16,
  },
  inputText: {
    color: '#111',
    fontSize: 16,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    margin: 10,
    width: 300,
    fontSize: 16,
  },
  textFieldSelect: {
    margin: '10 10 10 0',
    width: 300,
    fontSize: 16,
  },
  inputLabel: {
    color: '#707070 !important',
    fontSize: 18,
  },
  cardWidth: {
    minWidth: 300,
    borderRadius: 0,
  },
  cardHeader: {
    backgroundColor: '#114161',
    color: '#fff',
  },
  note: {
    color: '#DA190B',
    marginTop: theme.spacing.unit,
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
})

const inputLabelProps = {
  style: {
    color: '#707070',
    fontSize: 18,
  },
}

const helperTextProps = {
  style: {
    fontSize: 10,
  },
}

const emptyCounty = {
  id: 0,
  name: '',
}

const prepareChildInfo = childInfo => {
  if (childInfo.cases.length === 0) {
    childInfo.cases.push({ external_id: '' })
  }
  return childInfo
}

const prepareChildInfoValidation = (childInfo, isNewForm) => {
  const validation = {
    first_name: !isNewForm,
    last_name: !isNewForm,
    middle_name: true,
    suffix: true,
    dob: !isNewForm,
    external_id: !isNewForm,
    county: !isNewForm,
    cases: [],
  }

  childInfo.cases.map(() => validation.cases.push({ external_id: true }))

  return validation
}

class ClientAddEditForm extends Component {
  constructor(props) {
    super(props)
    const { client, isNewForm } = props
    this.state = {
      childInfo: prepareChildInfo(client),
      initialSensitivityType: client.sensitivity_type,
      childInfoValidation: prepareChildInfoValidation(client, isNewForm),
      counties: [],
      sensitivityTypes: [],
      userCounty: emptyCounty,
      isUsersCounty: true,
      isSaveButtonDisabled: isNewForm,
      redirection: {
        shouldRedirect: false,
        successClientId: null,
      },
    }
  }

  async componentDidMount() {
    await this.fetchCounties()
    await this.fetchUserAccount()
    await this.fetchSensitivityTypes(this.state.childInfo.county)
    this.handleDefaultCounty(this.state.userCounty.name)
  }

  fetchCounties() {
    return CountiesService.fetchCounties().then(counties => this.setState({ counties }))
  }

  fetchSensitivityTypes(county) {
    return SensitivityTypesService.fetch(county).then(sensitivityTypes => {
      this.setSensitivityTypes(sensitivityTypes)
    })
  }

  setSensitivityTypes(sensitivityTypes) {
    this.setState({ sensitivityTypes })
    if (!sensitivityTypes || sensitivityTypes.length === 0) {
      this.setState({
        childInfo: {
          ...this.state.childInfo,
          sensitivity_type: this.state.initialSensitivityType,
        },
      })
    }
  }

  fetchUserAccount() {
    return UserAccountService.fetchCurrent()
      .then(user => this.setState({ userCounty: { id: parseInt(user.county_code, 10), name: user.county_name } }))
      .catch(() => {})
  }

  handleDefaultCounty(defaultCountyName) {
    const county = this.state.counties.find(county => county.name === defaultCountyName) || emptyCounty
    this.countyValidate(county)
  }

  handleCountyChange = event => {
    const county = this.state.counties.find(county => county.name === event.target.value) || emptyCounty
    this.countyValidate(county)
  }

  countyValidate = county => {
    this.setState({
      childInfo: {
        ...this.state.childInfo,
        county: county,
      },
    })
    this.fetchSensitivityTypes(county)
    this.validateInput('county', county)
    county.name === this.state.userCounty.name
      ? this.setState({ isUsersCounty: true })
      : this.setState({ isUsersCounty: false })
  }

  handleSensitivityTypeChange = event => {
    const sensitivityType = this.state.sensitivityTypes.find(type => type === event.target.value) || null
    this.setState({
      childInfo: {
        ...this.state.childInfo,
        sensitivity_type: sensitivityType,
      },
    })
  }

  handleChange = name => event => {
    const newValue = event.target.value
    this.setState({
      childInfo: {
        ...this.state.childInfo,
        [name]: newValue,
      },
    })
    this.validateInput(name, newValue)
  }

  validateInput = (fieldName, inputValue) => {
    const allValidations = this.state.childInfoValidation
    allValidations[fieldName] = validate(fieldName, inputValue)
    this.setState({
      childInfoValidation: {
        ...allValidations,
      },
      isSaveButtonDisabled: !isFormValid(allValidations),
    })
  }

  handleChangeCaseNumber = caseIndex => event => {
    const cases = clone(this.state.childInfo.cases)
    cases[caseIndex].external_id = event.target.value
    const childInfoValidation = {
      ...this.state.childInfoValidation,
      cases: this.validateCaseNumbers(cases),
    }
    this.setState({
      childInfo: {
        ...this.state.childInfo,
        cases,
      },
      childInfoValidation,
      isSaveButtonDisabled: !isFormValid(childInfoValidation),
    })
  }

  validateCaseNumbers = cases => {
    const casesValidations = clone(this.state.childInfoValidation.cases)
    for (const [index, aCase] of cases.entries()) {
      casesValidations[index].external_id = validateCase(aCase)
    }
    const nonUniqueCasesIndices = validateCaseNumbersAreUnique(cases)
    nonUniqueCasesIndices.forEach(index => (casesValidations[index].external_id = false))
    return casesValidations
  }

  handleSubmit = event => {
    const childInfo = this.prepareChildForSubmit(clone(this.state.childInfo))
    if (this.props.isNewForm) {
      event.preventDefault()
      ClientService.addClient(childInfo)
        .then(newChild => {
          this.setState({
            childInfo: newChild,
            redirection: {
              shouldRedirect: true,
              successClientId: newChild.id,
            },
          })
        })
        .catch(error => this.handleError(error))
    } else {
      ClientService.updateClient(childInfo.id, childInfo)
        .then(updatedChild => {
          this.setState({
            childInfo: updatedChild,
            redirection: {
              shouldRedirect: true,
              successClientId: updatedChild.id,
            },
          })
        })
        .catch(error => this.handleError(error))
    }
  }

  handleError = error => {
    const errorResponse = error.response
    if (errorResponse && errorResponse.status === 409) {
      const errorMessage =
        errorResponse.data &&
        errorResponse.data.issue_details &&
        errorResponse.data.issue_details[0] &&
        errorResponse.data.issue_details[0].technical_message
      errorMessage ? this.setState({ error: { message: errorMessage } }) : this.setState({ error })
    }
  }

  prepareChildForSubmit(childInfo) {
    const cases = childInfo.cases
    for (let i = cases.length - 1; i >= 0; i--) {
      if (!cases[i].external_id) {
        cases.splice(i, 1)
      }
    }
    return childInfo
  }

  handleCancel = () => {
    this.setState({
      redirection: {
        shouldRedirect: true,
      },
    })
  }

  handleAddCaseNumber = event => {
    if (isA11yAllowedInput(event)) {
      const childInfo = this.addCaseNumberToChildInfo()
      const childInfoValidation = this.addCaseNumberToValidations()
      this.setState({
        childInfo,
        childInfoValidation,
        isSaveButtonDisabled: !isFormValid(childInfoValidation),
      })
    }
  }

  addCaseNumberToChildInfo = () => {
    const cases = clone(this.state.childInfo.cases)
    cases.push({ external_id: '' })
    return {
      ...this.state.childInfo,
      cases: cases,
    }
  }

  addCaseNumberToValidations = () => {
    const casesValidation = clone(this.state.childInfoValidation.cases)
    casesValidation.push({ external_id: true })
    return {
      ...this.state.childInfoValidation,
      cases: casesValidation,
    }
  }

  redirectPath = childId => {
    const { redirection, isUsersCounty } = this.state
    const { successClientId } = redirection
    const isEdit = !!childId
    const isCancel = !successClientId
    const notUsersCounty = !isUsersCounty
    const cancelWhenNotUsersCountyWhileEditing = isEdit && notUsersCounty && isCancel
    const isUsersCountyWhileEditing = isUsersCounty && isEdit
    return isUsersCountyWhileEditing || cancelWhenNotUsersCountyWhileEditing ? `/clients/${childId}` : '/'
  }

  renderNameInputs(field, label, maxLength, isRequired) {
    const { classes } = this.props
    const { childInfo, childInfoValidation } = this.state
    return (
      <TextField
        required={isRequired}
        id={field}
        label={label}
        error={!childInfoValidation[field]}
        className={classes.textField}
        value={stringify(childInfo[field])}
        onChange={this.handleChange(field)}
        inputProps={{
          maxLength: maxLength,
          className: classes.inputText,
        }}
        margin="normal"
        InputLabelProps={inputLabelProps}
      />
    )
  }

  renderCountiesDropDown = () => {
    const { classes } = this.props
    const { childInfo, childInfoValidation, counties } = this.state
    const isValid = childInfoValidation['county']
    return (
      <div className={classes.root}>
        <FormControl required error={!isValid} className={classes.formControl} id={'county-dropdown'}>
          <InputLabel htmlFor="county-select" className={classes.inputLabel}>
            County
          </InputLabel>
          <Select
            id={'select-wrapper'}
            native
            value={childInfo.county.name}
            onChange={this.handleCountyChange}
            name="county"
            className={classes.textFieldSelect}
            inputProps={{
              id: 'county-select',
              className: classes.inputSelect,
            }}
          >
            <option key={0} value="" />
            {counties.map(county => (
              <option key={county.id} value={county.name}>
                {county.name}
              </option>
            ))}
          </Select>
          <FormHelperText>{!isValid ? 'Please select your County' : null}</FormHelperText>
        </FormControl>
      </div>
    )
  }

  renderSingleCaseNumber = (index, aCase) => {
    const { classes } = this.props
    const { childInfoValidation } = this.state
    return (
      <InputMask
        key={index}
        mask="9999-999-9999-99999999"
        value={aCase.external_id}
        onChange={this.handleChangeCaseNumber(index)}
      >
        {() => (
          <TextField
            key={index}
            id={`caseNumber${index}`}
            label={'Case Number'}
            error={!childInfoValidation.cases[index].external_id}
            className={classes.textField}
            helperText={!childInfoValidation.cases[index].external_id ? 'Enter 19 digits number' : null}
            inputProps={{ className: classes.inputText }}
            margin="normal"
            InputLabelProps={inputLabelProps}
            FormHelperTextProps={helperTextProps}
          />
        )}
      </InputMask>
    )
  }

  renderCaseNumbers = () => {
    const { cases } = this.state.childInfo
    let renderedCases = []
    for (let i = cases.length - 1; i >= 0; i--) {
      renderedCases.push(this.renderSingleCaseNumber(i, cases[i]))
    }
    return renderedCases
  }

  renderCaseNumbersBlock = () => {
    return (
      <div className={'case-numbers'}>
        {this.renderCaseNumbers()}
        <div className={'case-numbers-controls'}>
          <div
            onClick={this.handleAddCaseNumber}
            onKeyPress={this.handleAddCaseNumber}
            className={'case-numbers-single-control'}
            role={'button'}
            tabIndex={0}
          >
            + ADD CASE NUMBER
          </div>
        </div>
      </div>
    )
  }

  renderSensitivityTypeDropDown = () => {
    if (!this.state.sensitivityTypes.length) {
      return null
    }
    const { classes } = this.props
    const { childInfo, sensitivityTypes } = this.state
    return (
      <div className={classes.root} id={'sensitivity_type_dropdown'}>
        <FormControl required={false} className={'mt-0 ' + classes.formControl}>
          <InputLabel htmlFor="sensitivity-type-select" className={classes.inputLabel}>
            Access Restrictions
          </InputLabel>
          <Select
            native
            value={childInfo.sensitivity_type !== null ? childInfo.sensitivity_type : 'N/A'}
            onChange={this.handleSensitivityTypeChange}
            name="sensitivity-type"
            className={classes.textFieldSelect}
            inputProps={{
              id: 'sensitivity-type-select',
              className: classes.inputSelect,
            }}
          >
            <option key={''} value="N/A">
              Unrestricted
            </option>
            {sensitivityTypes.map(type => (
              <option key={type} value={type} className={'sensitivity_type_option'}>
                {type === 'SENSITIVE' ? 'Sensitive' : type === 'SEALED' ? 'Sealed' : type}
              </option>
            ))}
          </Select>
        </FormControl>
      </div>
    )
  }

  renderFormFooter = () => {
    const { classes } = this.props
    const { isSaveButtonDisabled, isUsersCounty, error } = this.state
    return (
      <div className={'add-edit-form-footer'}>
        {!isUsersCounty && (
          <Row>
            <Col sm={12}>
              <CloseableAlert
                message="The Child's County does not match the User's County. This will result in being unable to view the Child record."
                type={alertType.WARNING}
              />
            </Col>
          </Row>
        )}
        {error && (
          <Row>
            <Col sm={12}>
              <CloseableAlert message={error.message} type={alertType.DANGER} />
            </Col>
          </Row>
        )}
        <Row>
          <Col sm={4}>{isSaveButtonDisabled && <p className={classes.note}>*required fields</p>}</Col>
          <Col sm={8} className={'add-edit-form-controls'}>
            <Button id={'cancel-button'} color={'link'} className={'cancel-button'} onClick={this.handleCancel}>
              Cancel
            </Button>
            <Button id={'save-button'} color={'primary'} disabled={isSaveButtonDisabled} onClick={this.handleSubmit}>
              Save
            </Button>
          </Col>
        </Row>
      </div>
    )
  }

  render() {
    const { classes, isNewForm } = this.props
    const { childInfo, childInfoValidation, redirection } = this.state
    const { shouldRedirect, successClientId } = redirection

    if (shouldRedirect) {
      return <Redirect push to={{ pathname: this.redirectPath(childInfo.id), state: { isNewForm, successClientId } }} />
    }

    return (
      <MuiThemeProvider theme={theme}>
        <PageInfo title={isNewForm ? 'Add Child/Youth' : 'Edit Child/Youth'} />
        <Card className={classes.cardWidth}>
          <CardHeader
            className={'card-header-cans'}
            title="Child/Youth Information"
            classes={{ title: classes.title }}
          />

          <div className={'content'}>
            <CardContent>
              <form className={classes.container} noValidate autoComplete="off">
                {this.renderNameInputs('first_name', 'First Name', FIRST_MIDDLE_NAME_MAX_LENGTH, true)}
                {this.renderNameInputs('middle_name', 'Middle Name', FIRST_MIDDLE_NAME_MAX_LENGTH, false)}
                {this.renderNameInputs('last_name', 'Last Name', LAST_NAME_MAX_LENGTH, true)}
                {this.renderNameInputs('suffix', 'Suffix', SUFFIX_MAX_LENGTH, false)}

                <MaskedDateField
                  id={'dob'}
                  isRequired
                  value={childInfo.dob}
                  label="Date of Birth"
                  isFutureDatesAllowed={false}
                  error={!childInfoValidation['dob']}
                  className={classes.textField}
                  inputProps={{ className: classes.inputText }}
                  InputLabelProps={inputLabelProps}
                  FormHelperTextProps={helperTextProps}
                  onChange={this.handleChange('dob')}
                />

                <InputMask
                  mask="9999-9999-9999-9999999"
                  value={childInfo.external_id}
                  onChange={this.handleChange('external_id')}
                >
                  {() => (
                    <TextField
                      required
                      id="external_id"
                      label="Client Id"
                      helperText={!childInfoValidation['external_id'] ? 'Enter 19 digits number' : null}
                      error={!childInfoValidation['external_id']}
                      className={classes.textField}
                      margin="normal"
                      inputProps={{ className: classes.inputText }}
                      InputLabelProps={inputLabelProps}
                      FormHelperTextProps={helperTextProps}
                    />
                  )}
                </InputMask>
                <div>
                  {this.renderCountiesDropDown()}
                  {this.renderSensitivityTypeDropDown()}
                </div>
                {this.renderCaseNumbersBlock()}
              </form>
              {this.renderFormFooter()}
            </CardContent>
          </div>
        </Card>
      </MuiThemeProvider>
    )
  }
}

ClientAddEditForm.propTypes = {
  classes: PropTypes.object.isRequired,
  client: PropTypes.object,
  isNewForm: PropTypes.bool.isRequired,
}

ClientAddEditForm.defaultProps = {
  client: {
    person_role: 'CLIENT',
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    dob: '',
    external_id: '',
    county: emptyCounty,
    cases: [{ external_id: '' }],
  },
}

export default withStyles(styles)(ClientAddEditForm)
