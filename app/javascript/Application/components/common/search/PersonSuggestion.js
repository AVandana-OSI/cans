import React from 'react'
import PropTypes from 'prop-types'
import AvatarImg from '../../../../../assets/images/default-profile.svg'
import Gender from './Gender'
import AgeInfo from './AgeInfo'
import LanguageInfo from './LanguageInfo'
import AddressInfo from './AddressInfo'
import PhoneNumberInfo from './PhoneNumberInfo'
import sanitizeHtml from 'sanitize-html'
import LegacyInfo from './LegacyInfo'

const PersonSuggestion = ({
  fullName,
  dateOfBirth,
  gender,
  races,
  ssn,
  address,
  languages,
  phoneNumber,
  isSensitive,
  isSealed,
  legacyDescriptor,
  clientCounties,
}) => {
  const sanitizedField = field => ({
    dangerouslySetInnerHTML: {
      __html: sanitizeHtml(field, { allowedTags: ['em'] }),
    },
  })
  return (
    <div className="row">
      <div className="col-md-5">
        <div className="row">
          <div className="col-md-4 profile-picture">
            <img className="avatar-img" src={AvatarImg} alt="Avatar" />
            {isSensitive && (
              <div className="information-flag image-caption">Sensitive</div>
            )}
            {isSealed && (
              <div className="information-flag image-caption">Sealed</div>
            )}
          </div>
          <div className="col-md-8">
            <div className="row name-row">
              <div
                className="highlighted full-name"
                {...sanitizedField(fullName)}
              />
            </div>
            <div className="row gender-age-row">
              <Gender gender={gender} />
              <AgeInfo dateOfBirth={dateOfBirth} />
            </div>
            <div className="row search-item-header">Primary Language</div>
            <div className="row">{<LanguageInfo languages={languages} />}</div>
          </div>
        </div>
      </div>
      <div className="col-md-7">
        <div className="row county-client-case-row">
          <div className="col-md-4">
            <div className="row search-item-header">County of Jurisdiction</div>
            <div className="row">
              <span>{clientCounties[0]}</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="row search-item-header">Client ID</div>
            <div className="row">
              <LegacyInfo {...legacyDescriptor} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="row search-item-header">Case Number</div>
            <div className="row">
              <span>0</span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="row search-item-header">Active Address</div>
            <div className="row">{<AddressInfo {...address} />}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
PersonSuggestion.defaultProps = {
  address: {},
  dateOfBirth: '',
  fullName: '',
  gender: '',
  isCsec: false,
  isDeceased: false,
  isProbationYouth: false,
  isSealed: false,
  isSensitive: false,
  languages: [],
  // legacyDescriptor: {},
  phoneNumber: {},
  races: [],
  ssn: '',
}
PersonSuggestion.propTypes = {
  address: PropTypes.object,
  dateOfBirth: PropTypes.string,
  fullName: PropTypes.string,
  gender: PropTypes.string,
  isCsec: PropTypes.bool,
  isDeceased: PropTypes.bool,
  isProbationYouth: PropTypes.bool,
  isSealed: PropTypes.bool,
  isSensitive: PropTypes.bool,
  languages: PropTypes.array,
  // legacyDescriptor: PropTypes.object,
  phoneNumber: PropTypes.object,
  races: PropTypes.array,
  ssn: PropTypes.string,
}

export default PersonSuggestion
