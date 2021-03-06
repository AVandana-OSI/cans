import React from 'react'
import { navigation, BreadCrumbLinks, dashboards } from '../../../util/constants'
import { userDashboardChecker } from '../../../util/userDashboardChecker'
import { formatName, selfChecker, crumbsGroup, selfCheckerKeyWords } from './BreadCrumbHelper'
import { Link } from 'react-router-dom'

export const homeCrumbHandler = (user, elements) => {
  let url
  let linkText
  switch (userDashboardChecker(user)) {
    case dashboards.STAFF_LIST:
      url = '/staff'
      linkText = BreadCrumbLinks.STAFF_LIST
      break
    case dashboards.CHILD_LIST:
      url = '/clients'
      linkText = BreadCrumbLinks.CLIENT_LIST
      break
    default:
      url = '/search'
      linkText = BreadCrumbLinks.CLIENT_SEARCH
      break
  }
  elements.push(<Link to={url}>{linkText}</Link>)
}

export const addStaffListIfNeeded = (elements, navigateTo) => {
  if (selfChecker(navigateTo, selfCheckerKeyWords.STAFF_LIST)) {
    elements.push(BreadCrumbLinks.STAFF_LIST)
  }
}

export const addStaffProfileIfNeeded = (elements, navigateTo, staffPerson) => {
  if (selfChecker(navigateTo, selfCheckerKeyWords.STAFF_READ)) {
    elements.push(formatName(staffPerson))
  }
  if (crumbsGroup.staffProfile.includes(navigateTo)) {
    elements.push(<Link to={`/staff/${staffPerson.identifier}`}>{formatName(staffPerson)}</Link>)
  }
}

export const addChildYouthListCrumbIfNeeded = (elements, navigateTo) => {
  if (selfChecker(navigateTo, selfCheckerKeyWords.CHILD_LIST)) {
    elements.push(BreadCrumbLinks.CLIENT_LIST)
  } else if (crumbsGroup.clientList.includes(navigateTo)) {
    elements.push(<Link to={'/clients'}>{BreadCrumbLinks.CLIENT_LIST}</Link>)
  }
}

export const addStaffChildProfileCrumbIfNeeded = (elements, navigateTo, client, staffPerson) => {
  if (navigateTo === navigation.STAFF_ASSESSMENT_EDIT || navigateTo === navigation.STAFF_ASSESSMENT_ADD) {
    elements.push(
      <Link to={`/staff/${staffPerson.identifier}/clients/${client.identifier}`}>{formatName(client)}</Link>
    )
  }
}

export const addChildProfileCrumbIfNeeded = (elements, navigateTo, client, staffPerson) => {
  if (selfChecker(navigateTo, selfCheckerKeyWords.PROFILE_OVERALL)) {
    elements.push(formatName(client))
  } else if (navigateTo === navigation.SEARCH_ASSESSMENT_EDIT) {
    elements.push(<Link to={`/search/clients/${client.identifier}`}>{formatName(client)}</Link>)
  } else if (navigateTo === navigation.SEARCH_ASSESSMENT_ADD) {
    elements.push(<Link to={`/search/clients/${client.identifier}`}>{formatName(client)}</Link>)
  } else if (crumbsGroup.clientProfile.includes(navigateTo)) {
    elements.push(<Link to={`/clients/${client.identifier}`}>{formatName(client)}</Link>)
  }
}

export const addAssessmentFormCrumbIfNeeded = (elements, navigateTo, client, assessmentId) => {
  if (selfChecker(navigateTo, selfCheckerKeyWords.ASSESSMENT_EDIT)) {
    elements.push(BreadCrumbLinks.CANS_ASSESSMENT_FORM)
  } else if (selfChecker(navigateTo, selfCheckerKeyWords.ASSESSMENT_ADD)) {
    elements.push(BreadCrumbLinks.CANS_ASSESSMENT_FORM)
  } else if (crumbsGroup.assessmentForm.includes(navigateTo)) {
    elements.push(
      <Link to={`/clients/${client.identifier}/assessments/${assessmentId}`}>
        {BreadCrumbLinks.CANS_ASSESSMENT_FORM}
      </Link>
    )
  }
}

export const addClientSearchCrumbIfNeeded = (elements, navigateTo) => {
  if (selfChecker(navigateTo, selfCheckerKeyWords.CLIENT_SEARCH)) {
    elements.push(BreadCrumbLinks.CLIENT_SEARCH)
  } else if (crumbsGroup.search.includes(navigateTo)) {
    elements.push(<Link to={`/search`}>{BreadCrumbLinks.CLIENT_SEARCH}</Link>)
  }
}

export const addChangeLogCrumbIfNeeded = (elements, navigateTo, url) => {
  if (navigateTo === navigation.ASSESSMENT_CHANGELOG) {
    elements.push('Change Log')
  } else if (crumbsGroup.changelog.includes(navigateTo)) {
    elements.push(<Link to={`${url}/changelog`}>Change Log</Link>)
  }
}
