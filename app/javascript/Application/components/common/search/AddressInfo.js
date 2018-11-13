import PropTypes from 'prop-types'
import React from 'react'

const AddressInfo = address => {
  const { streetAddress, city, state, zip } = address
  const stateZip = [state, zip].filter(Boolean).join(' ')
  return (
    <div>
      <span>
        {streetAddress} {[city, stateZip].filter(Boolean).join(', ')}
      </span>
    </div>
  )
}
AddressInfo.defaultProps = {
  city: '',
  state: '',
  streetAddress: '',
  type: '',
  zip: '',
}
AddressInfo.propTypes = {
  city: PropTypes.string,
  state: PropTypes.string,
  streetAddress: PropTypes.string,
  type: PropTypes.string,
  zip: PropTypes.string,
}
export default AddressInfo
