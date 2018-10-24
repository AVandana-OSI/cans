import PropTypes from 'prop-types'

export const staffPropType = PropTypes.shape({
  staff_person: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }).isRequired,
  in_progress_count: PropTypes.number.isRequired,
})
