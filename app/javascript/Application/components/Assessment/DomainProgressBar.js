import React from 'react'
import PropTypes from 'prop-types'
import { shouldItemBeRendered } from './AssessmentHelper'
import Grid from '@material-ui/core/Grid'

import './style.sass'

const buildState = (isAssessmentUnderSix, domain) => {
  const total = domain.items.filter(item => shouldItemBeRendered(isAssessmentUnderSix, item) && item.required)
  const filled = total.filter(item => item.rating !== -1)
  return {
    total: total.length,
    filled: filled.length,
    progress: Math.round((filled.length / total.length) * 100),
  }
}

class DomainProgressBar extends React.PureComponent {
  constructor(props) {
    super(props)
    const { isAssessmentUnderSix, domain } = this.props
    this.state = buildState(isAssessmentUnderSix, domain)
  }

  static getDerivedStateFromProps(props) {
    const { isAssessmentUnderSix, domain } = props
    return buildState(isAssessmentUnderSix, domain)
  }

  render() {
    const { filled, total, progress } = this.state
    return (
      <Grid container direction="row" justify="flex-end" alignItems="flex-end" spacing={0} style={{ padding: 0 }}>
        <Grid item xs={8}>
          <div
            className={'domain-progress-bar'}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ marginBottom: 6, marginRight: 0 }}
          >
            <div className={'progress-line'} style={{ width: `${progress}%`, marginBottom: 6, marginRight: 0 }} />
          </div>
        </Grid>
        <Grid item xs={4}>
          {<span className={'progress-value'}>{`${filled}/${total}`}</span>}
        </Grid>
      </Grid>
    )
  }
}

DomainProgressBar.propTypes = {
  domain: PropTypes.object.isRequired,
  isAssessmentUnderSix: PropTypes.bool.isRequired,
}

export default DomainProgressBar
