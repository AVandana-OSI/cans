import React from 'react';
import PropTypes from 'prop-types';
import Autocompleter from '../common/search/Autocompleter';

class PersonSearchForm extends React.Component {
  constructor(props) {
    super(props);
  }

  //   componentWillUnmount() {
  //     this.props.onClear();
  //     this.props.onChange('');
  //   }

  render() {
    const { searchTitle, searchPrompt } = this.props;
    // const { searchPrompt, ...autocompleterProps } = this.props;

    return (
      <div>
        <div className="card double-gap-bottom hidden-print" id="search-card">
          <div className="card-header">
            <h2>{searchTitle}</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <label className="pull-left" htmlFor="client-search-autocompleter">
                  {searchPrompt}
                </label>
                <Autocompleter
                  id="client-search-autocompleter"
                  // {...autocompleterProps}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PersonSearchForm.defaultProps = {
  // location: PropTypes.shape({
  //   pathname: PropTypes.string,
  // }),
  // onLoadMoreResults: PropTypes.func,
  // searchCounty: PropTypes.string,
};

PersonSearchForm.propTypes = {
  // location: PropTypes.shape({
  //   pathname: PropTypes.string,
  // }),
  // onLoadMoreResults: PropTypes.func,
  // searchCounty: PropTypes.string,
  searchPrompt: PropTypes.string.isRequired,
};

export default PersonSearchForm;
