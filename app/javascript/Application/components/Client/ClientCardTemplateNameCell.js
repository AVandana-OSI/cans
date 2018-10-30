import React from 'react'
import PropTypes from 'prop-types'

const ClientSocialWorkerTemplateCell = props => {
  return (
    <a key={props.original.external_id} href={`/clients/${props.original.external_id}`}>
      {props.value}
    </a>
  )
}

ClientSocialWorkerTemplateCell.propTypes = {
  original: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
}

export default ClientSocialWorkerTemplateCell
