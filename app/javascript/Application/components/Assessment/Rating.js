import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

class Rating extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleChange = onChangeEvent => {
    this.props.onRatingUpdate(onChangeEvent)
  }

  renderNaOptionIfNeeded = () => {
    return this.props.hasNaOption ? <MenuItem value={8}>N/A</MenuItem> : null
  }

  renderBooleanSelect = () => {
    return (
      <Select value={this.props.rating} onChange={this.handleChange}>
        <MenuItem value={-1} />
        {this.renderNaOptionIfNeeded()}
        <MenuItem value={0}>No</MenuItem>
        <MenuItem value={1}>Yes</MenuItem>
      </Select>
    )
  }

  renderRegularSelect = () => {
    return (
      <Select value={this.props.rating} onChange={this.handleChange}>
        <MenuItem value={-1} />
        {this.renderNaOptionIfNeeded()}
        <MenuItem value={0}>0</MenuItem>
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={3}>3</MenuItem>
      </Select>
    )
  }

  render = () => {
    const isRegularType = this.props.rating_type === 'REGULAR'
    return (
      <div style={{ display: 'flex' }}>
        <Typography
          variant="body2"
          style={{
            marginTop: '6px',
            marginRight: '6px',
          }}
        >
          Rating:
        </Typography>
        <form autoComplete="off">
          <FormControl>{isRegularType ? this.renderRegularSelect() : this.renderBooleanSelect()}</FormControl>
        </form>
      </div>
    )
  }
}

Rating.propTypes = {
  hasNaOption: PropTypes.bool.isRequired,
  onRatingUpdate: PropTypes.func.isRequired,
  rating: PropTypes.number.isRequired,
  rating_type: PropTypes.string.isRequired,
}

export default Rating
