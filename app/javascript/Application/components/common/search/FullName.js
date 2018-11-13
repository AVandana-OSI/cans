import React from 'react'
import PropTypes from 'prop-types'
import sanitizeHtml from 'sanitize-html'

const FullName = ({ fullName }) => {
  const sanitizedField = field => ({
    dangerouslySetInnerHTML: {
      __html: boldMatchedTerm(sanitizeHtml(field, { allowedTags: ['em'] })),
    },
  })
  const boldMatchedTerm = field => field.split('em').join('strong')
  return fullName ? <div className="highlighted full-name" {...sanitizedField(fullName)} /> : null
}

FullName.defaultProps = {
  fullName: '',
}

FullName.propTypes = {
  fullName: PropTypes.string,
}

export default FullName
