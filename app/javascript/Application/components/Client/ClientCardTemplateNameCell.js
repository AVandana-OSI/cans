import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const ClientSocialWorkerTemplateCell = props => {
  return (
    <Link id="linkedFullName" key={props.original.external_id} to={`/clients/${props.original.external_id}`}>
      {props.value}
    </Link>
  )
}

ClientSocialWorkerTemplateCell.propTypes = {
  original: PropTypes.object.isRequired,
}

export default ClientSocialWorkerTemplateCell
