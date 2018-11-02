import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { getI18nByCode } from './I18nHelper'
import Domain from './Domain'
import { clone } from '../../util/common'

const INDICES = 'abcdefghijklmnopqrstuvwxyz'

class Assessment extends Component {
  /* eslint-disable camelcase */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.assessment.state.domains.length === 0 && nextProps.assessment.state.domains.length !== 0) {
      const assessment = Object.assign({}, nextProps.assessment)
      this.updateCaregiverDomainsIndices(assessment.state)
      this.props.onAssessmentUpdate(assessment)
    }
  }
  /* eslint-enable camelcase */

  componentDidUpdate(prevProps) {
    const hasCaregiver = this.props.assessment.has_caregiver
    const hasCaregiverChange = hasCaregiver !== prevProps.assessment.has_caregiver
    if (hasCaregiverChange && !hasCaregiver) {
      this.removeAllCaregiverDomains()
    } else if (hasCaregiverChange && hasCaregiver) {
      this.addInitialCaregiverDomain()
    }
  }

  handleUpdateItemRating = (code, rating, caregiverIndex) => {
    this.updateItem(code, 'rating', rating, caregiverIndex)
  }

  handleUpdateItemConfidentiality = (code, isConfidential, caregiverIndex) => {
    this.updateItem(code, 'confidential', isConfidential, caregiverIndex)
  }

  updateItem = (itemCode, key, value, itemCaregiverIndex) => {
    const assessment = clone(this.props.assessment)
    assessment.state.domains.map(domain => {
      if (itemCaregiverIndex !== domain.caregiver_index) return
      domain.items.map(item => {
        if (item.code === itemCode) {
          item[key] = value
        }
      })
    })
    this.props.onAssessmentUpdate(assessment)
  }

  updateCaregiverDomainsIndices(assessmentState) {
    let i = 0
    assessmentState.domains
      .filter(domain => domain.is_caregiver_domain)
      .map(domain => (domain.caregiver_index = INDICES[i++]))
    return assessmentState
  }

  addCaregiverDomainAfter = caregiverIndex => {
    const assessment = clone(this.props.assessment)
    const domains = assessment.state.domains
    for (const [index, domain] of domains.entries()) {
      if (domain.caregiver_index === caregiverIndex) {
        domains.splice(index + 1, 0, clone(assessment.state.caregiver_domain_template))
        break
      }
    }
    this.updateCaregiverDomainsIndices(assessment.state)
    this.props.onAssessmentUpdate(assessment)
  }

  addInitialCaregiverDomain() {
    const assessment = clone(this.props.assessment)
    const domains = assessment.state.domains
    domains.splice(domains.length - 1, 0, clone(assessment.state.caregiver_domain_template))
    this.updateCaregiverDomainsIndices(assessment.state)
    this.props.onAssessmentUpdate(assessment)
  }

  removeCaregiverDomain = caregiverIndex => {
    const assessment = clone(this.props.assessment)
    const domains = assessment.state.domains
    for (const [index, domain] of domains.entries()) {
      if (domain.caregiver_index === caregiverIndex) {
        domains.splice(index, 1)
        break
      }
    }
    if (!domains.filter(domain => domain.is_caregiver_domain).length) {
      assessment.has_caregiver = false
    }
    this.updateCaregiverDomainsIndices(assessment.state)
    this.props.onAssessmentUpdate(assessment)
  }

  removeAllCaregiverDomains() {
    const assessment = clone(this.props.assessment)
    const domains = assessment.state.domains
    const caregiverDomains = domains.filter(domain => domain.is_caregiver_domain)
    for (const caregiverDomain of caregiverDomains) {
      domains.splice(domains.findIndex(domain => domain.id === caregiverDomain.id), 1)
    }
    this.updateCaregiverDomainsIndices(assessment.state)
    this.props.onAssessmentUpdate(assessment)
  }

  updateCaregiverName = (caregiverIndex, caregiverName) => {
    const assessment = clone(this.props.assessment)
    for (const domain of assessment.state.domains) {
      if (domain.caregiver_index === caregiverIndex) {
        domain.caregiver_name = caregiverName
        break
      }
    }
    this.props.onAssessmentUpdate(assessment)
  }

  render() {
    const i18n = this.props.i18n
    const assessmentDto = this.props.assessment
    const canReleaseConfidentialInfo = assessmentDto.can_release_confidential_info
    const assessmentJson = assessmentDto.state
    const isUnderSix = assessmentJson.under_six
    const domains = assessmentJson.domains
    return (
      <Fragment>
        {domains.map((domain, index) => {
          const { code, caregiver_index: caregiverIndex } = domain
          const domainI18n = getI18nByCode(i18n, code)
          return (
            <Domain
              index={index}
              key={code + caregiverIndex}
              domain={domain}
              i18n={domainI18n}
              i18nAll={i18n}
              isAssessmentUnderSix={isUnderSix}
              canReleaseConfidentialInfo={canReleaseConfidentialInfo}
              onRatingUpdate={this.handleUpdateItemRating}
              onConfidentialityUpdate={this.handleUpdateItemConfidentiality}
              onAddCaregiverDomain={this.addCaregiverDomainAfter}
              onRemoveCaregiverDomain={this.removeCaregiverDomain}
              onCaregiverNameUpdate={this.updateCaregiverName}
              handleWarningShow={this.props.handleWarningShow}
            />
          )
        })}
      </Fragment>
    )
  }
}

Assessment.propTypes = {
  assessment: PropTypes.object.isRequired,
  handleWarningShow: PropTypes.func,
  i18n: PropTypes.object.isRequired,
  onAssessmentUpdate: PropTypes.func.isRequired,
}

Assessment.defaultProps = {
  handleWarningShow: () => {},
}

export default Assessment
