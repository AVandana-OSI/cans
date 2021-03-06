import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'
import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'

const PrimCheckbox = withStyles({
  root: {
    '&$checked': {
      color: '#09798E',
    },
  },
  checked: {},
})(Checkbox)

const naRating = 8

const ItemNaCheckbox = props => {
  const isNachecked = props.rating === naRating // bind to rating, because value is oppsite
  return (
    <Typography variant="title" style={{ marginRight: 15 }}>
      <form autoComplete="off">
        <FormControl>
          <FormControlLabel
            onChange={props.handleRatingChange}
            label={'N/A'}
            value={props.naValue}
            control={<PrimCheckbox checked={isNachecked} />}
          />
        </FormControl>
      </form>
    </Typography>
  )
}

ItemNaCheckbox.propTypes = {
  handleRatingChange: PropTypes.func.isRequired,
  naValue: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
}

export default ItemNaCheckbox
