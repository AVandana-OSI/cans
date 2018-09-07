import React from 'react';
import PropTypes from 'prop-types';
import { shouldItemBeRendered } from './AssessmentHelper';

import './style.sass';

const buildState = (isAssessmentUnderSix, domain) => {
  const total = domain.items.filter(item => shouldItemBeRendered(isAssessmentUnderSix, item) && item.required);
  const filled = total.filter(item => item.rating !== -1);
  return {
    total: total.length,
    filled: filled.length,
    progress: Math.round((filled.length / total.length) * 100),
  };
};

class DomainProgressBar extends React.PureComponent {
  constructor(props) {
    super(props);
    const { isAssessmentUnderSix, domain } = this.props;
    this.state = buildState(isAssessmentUnderSix, domain);
  }

  static getDerivedStateFromProps(props) {
    const { isAssessmentUnderSix, domain } = props;
    return buildState(isAssessmentUnderSix, domain);
  }

  render() {
    const { filled, total, progress } = this.state;
    return (
      <div className={'domain-progress-bar'}>
        <div className={'progress-line'} style={{ width: `${progress}%` }} />
        <h5 className={'progress-value'}>{`${filled}/${total}`}</h5>
      </div>
    );
  }
}

DomainProgressBar.propTypes = {
  domain: PropTypes.object.isRequired,
  isAssessmentUnderSix: PropTypes.bool.isRequired,
};

export default DomainProgressBar;
