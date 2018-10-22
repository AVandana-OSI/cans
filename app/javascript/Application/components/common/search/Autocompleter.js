import PersonSuggestion from '../PersonSuggestion'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Autocomplete from 'react-autocomplete'
import SuggestionHeader from '../SuggestionHeader'
// import { canUserAddClient } from '../../../util/authorization';
// import CreateUnknownPerson from 'screenings/CreateUnknownPerson'
// import ShowMoreResults from '../common/ShowMoreResults'
// import {logEvent} from 'utils/analytics'
// import moment from 'moment';
import { Redirect } from 'react-router-dom'

const MIN_SEARCHABLE_CHARS = 2

const addPosAndSetAttr = results => {
  const one = 1
  for (let len = results.length, i = 0; i < len; ++i) {
    results[i].posInSet = i + one
    results[i].setSize = len
  }
}

const itemClassName = isHighlighted => `search-item${isHighlighted ? ' highlighted-search-item' : ''}`

export default class Autocompleter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuVisible: false,
      searchTerm: '',
      redirection: {
        shouldRedirect: false,
        successClientId: null,
        selectedClient: null,
      },
      results: [
        {
          id: 'client1',
          label: 'Client 1',
          // posInSet: 1,
          // setSize: 3,
          posInSet: 0,
          setSize: 0,
          suggestionHeader: false,
          fullName: 'Gus A Test',
          first_name: 'Gus',
          middle_name: '',
          last_name: 'A Test',
          suffix: '',
          dateOfBirth: '2018/10/01',
          dob: '2018-10-01',
          external_id: 50001,
          isCsec: false,
          isDeceased: false,
          gender: 'male',
          languages: ['English'],
          races: ['Mexican'],
          ethnicity: { hispanic_latino_origin: 'Yes' },
          ssn: '123-45-6789',
          address: {
            type: 'Home',
            streetAddress: '1234 Main Street',
            city: 'Sacramento',
            state: 'CA',
            zip: '99999',
          },
          county: {
            export_id: '56',
            external_id: '1123',
            id: 56,
            name: 'Ventura',
          },
          sensitivity_type: 'SEALED',
          phoneNumber: {
            type: 'Mobile',
            number: '5551114444',
          },
          legacyDescriptor: '',
          isSensitive: false,
          isSealed: false,
          isProbationYouth: false,
        },
      ],
    }

    this.onFocus = this.onFocus.bind(this)
    this.hideMenu = this.hideMenu.bind(this)
    this.onItemSelect = this.onItemSelect.bind(this)
    this.renderMenu = this.renderMenu.bind(this)
    this.onChangeInput = this.onChangeInput.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.isSelectable = this.isSelectable.bind(this)
    this.shouldItemRender = this.shouldItemRender.bind(this)
  }

  // constructAddress() {
  //   const { searchAddress, searchCity, searchCounty } = this.props;
  //   return {
  //     address: searchAddress,
  //     city: searchCity,
  //     county: searchCounty,
  //   };
  // }

  // searchAndFocus(...searchArgs) {
  //   this.props.onSearch(...searchArgs);
  //   this.setState({ menuVisible: true });
  //   if (this.inputRef) {
  //     this.inputRef.focus();
  //   }
  // }

  // handleSubmit() {
  //   const { onClear, searchTerm } = this.props;
  //   onClear();
  //   this.searchAndFocus(searchTerm, this.constructAddress());
  // }

  // handleToggleAddressSearch(event) {
  //   const { onClear, searchTerm, onToggleAddressSearch } = this.props;

  //   onClear();
  //   if (!event.target.checked && this.isSearchable(this.props.searchTerm)) {
  //     this.searchAndFocus(searchTerm);
  //   }
  //   onToggleAddressSearch(event);
  // }

  isSearchable(value) {
    return value && value.replace(/^\s+/, '').length >= MIN_SEARCHABLE_CHARS
  }

  hideMenu() {
    if (this.inputRef) {
      this.inputRef.setAttribute('aria-activedescendant', '')
    }
    this.setState({ menuVisible: false })
  }

  // loadMoreResults() {
  //   const { isAddressIncluded, onLoadMoreResults } = this.props;
  //   if (isAddressIncluded) {
  //     onLoadMoreResults(this.constructAddress());
  //   } else {
  //     onLoadMoreResults();
  //   }
  // }

  // onButtonSelect(item) {
  //   if (item.createNewPerson) {
  //     this.onSelect({ id: null });
  //   } else if (item.suggestionHeader) {
  //     return;
  //   } else {
  //     this.loadMoreResults();
  //   }
  // }

  isSelectable(person) {
    return person.isSealed
    // canUserAddClient(userInfo, hasAddSensitivePerson, person, hasOverride);
  }

  onSelect(item) {
    // this.props.onClear();
    // this.props.onChange('');
    // this.props.onSelect(item);
    // this.setState({ searchTerm: item.fullName });
    // this.hideMenu();

    if (!item.suggestionHeader) {
      console.log(`Selected Client `, item)
      // if we did not click on the suggestion header, then redirect
      this.setState({ redirection: { shouldRedirect: true, selectedClient: item, successClientId: item.external_id } })
    }
  }

  onItemSelect(_value, item) {
    // const { isSelectable, staffId, startTime } = this.props;

    if (this.isSelectable(item)) {
      window.alert('You are not authorized to add this person.') // eslint-disable-line no-alert
      return
    }
    this.onSelect(item)
  }

  // onItemSelect(_value, item) {
  //   const { isSelectable, staffId, startTime } = this.props;

  //   if (!item.legacyDescriptor) {
  //     this.onButtonSelect(item);
  //     return;
  //   } else if (!isSelectable(item)) {
  //     alert('You are not authorized to add this person.'); // eslint-disable-line no-alert
  //     return;
  //   }

  //   logEvent('searchResultClick', {
  //     searchIndex: this.props.results.indexOf(item),
  //     staffId,
  //     startTime: moment(startTime).valueOf(),
  //   });
  //   this.onSelect(item);
  // }

  onFocus() {
    if (this.isSearchable(this.state.searchTerm)) {
      this.setState({ menuVisible: true })
    } else {
      this.hideMenu()
    }
  }

  renderMenu(items, _searchTerm, _style) {
    return <div className="autocomplete-menu">{items}</div>
  }

  renderEachItem(item, id, isHighlighted) {
    // const {total, results, searchTerm} = this.props
    const total = this.state.results.length
    const results = this.state.results
    const searchTerm = this.state.searchTerm

    const key = `${item.posInSet}-of-${item.setSize}`
    if (item.suggestionHeader) {
      return (
        <div id={id} key={key} aria-live="polite">
          <SuggestionHeader currentNumberOfResults={results.length} total={total} searchTerm={searchTerm} />
        </div>
      )
    }
    return (
      <div id={id} key={key} className={itemClassName(isHighlighted)}>
        <PersonSuggestion {...item} />
      </div>
    )
  }

  renderItem(item, isHighlighted, _styles) {
    // const {canCreateNewPerson, results, total} = this.props
    // const total = 0
    // const results = [0,1,2]

    // const canLoadMoreResults = results && total > results.length
    // const buttonClassName = canLoadMoreResults && canCreateNewPerson ? ' col-md-6' : ''
    // const className = itemClassName(isHighlighted) + buttonClassName
    const key = `${item.posInSet}-of-${item.setSize}`
    const id = `search-result-${key}`

    return this.renderEachItem(item, id, isHighlighted)
  }

  // getPeopleEffect({searchTerm, isClientOnly, searchAddress, sort}) {
  getPeopleEffect({ searchTerm }) {
    const uri = 'http://jsonplaceholder.typicode.com/posts/1'
    // const uri = 'https://web.preint.cwds.io/intake/api/v1/people?search_term=ca&is_client_only=false'
    return window.fetch(uri)

    // return call(get, '/api/v1/people', {
    //   search_term: searchTerm,
    //   is_client_only: isClientOnly,
    //   ...addressParams(searchAddress),
    //   ...searchAfterParams(sort),
    // })
  }

  onChangeInput(_, searchTerm) {
    this.setState({ searchTerm })

    if (this.isSearchable(searchTerm)) {
      this.setState({ menuVisible: true })
      this.getPeopleEffect({ searchTerm })
        .then(response => {
          return response.json()
        })
        .then(json => {
          // console.log(`onChangeInput API Response -`, JSON.stringify(json));
        })

      // const response = this.getPeopleEffect({searchTerm})
      // console.log(`onChangeInput API Response -`, response)
    } else {
      this.hideMenu()
    }

    // const {onSearch, onChange, isAddressIncluded} = this.props
    // if (this.isSearchable(value) && !isAddressIncluded) {
    //   // onSearch(value)
    //   this.setState({menuVisible: true})
    // } else {
    //   this.hideMenu()
    // }
    // onChange(value)
  }

  renderInput(props) {
    const newProps = {
      ...props,
      ref: el => {
        this.inputRef = el
        props.ref(el)
      },
    }
    return <input {...newProps} />
  }

  shouldItemRender(item, searchTerm) {
    if (item.suggestionHeader) {
      return true
    } else if (item.fullName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
      return true
    } else {
      return false
    }
  }

  renderAutocomplete() {
    // const { searchTerm, id, results, canCreateNewPerson, total } = this.props;
    // const showMoreResults = { showMoreResults: 'Show More Results', posInSet: 'show-more', setSize: 'the-same' };
    // const createNewPerson = { createNewPerson: 'Create New Person', posInSet: 'create-new', setSize: 'the-same' };
    // const suggestionHeader = [{ suggestionHeader: 'suggestion Header' }];
    // const canLoadMoreResults = results && total > results.length;
    addPosAndSetAttr(this.state.results) // Sequentually numbering items ***
    // const newResults = suggestionHeader.concat(results.concat(canLoadMoreResults ? showMoreResults : [], canCreateNewPerson ? createNewPerson : []))

    const { id } = this.props
    const suggestionHeader = [{ suggestionHeader: 'suggestion Header', fullName: '' }]
    const newResults = suggestionHeader.concat(this.state.results)

    return (
      <Autocomplete
        ref={el => (this.element_ref = el)}
        wrapperStyle={{ display: 'block' }}
        inputProps={{ id, onBlur: this.hideMenu, onFocus: this.onFocus }}
        renderInput={props => this.renderInput(props)}
        value={this.state.searchTerm}
        onChange={this.onChangeInput}
        renderMenu={this.renderMenu}
        open={this.state.menuVisible}
        items={newResults}
        renderItem={this.renderItem}
        getItemValue={item => item.fullName}
        onSelect={this.onItemSelect}
        shouldItemRender={this.shouldItemRender}
      />
    )
  }

  render() {
    const { redirection } = this.state
    const { shouldRedirect, successClientId } = redirection
    if (shouldRedirect) {
      return (
        <Redirect push to={{ pathname: `clients/${successClientId}`, state: { isNewForm: true, successClientId } }} />
      )
      // return <Redirect push to={{ pathname: `/clients/new`, state: { selectedClient } }} />;
    }
    return this.renderAutocomplete()
  }
}
Autocompleter.defaultProps = {
  canCreateNewPerson: false,
  id: '',
  isSelectable: () => true,
  results: [],
  searchTerm: '',
  staffId: '',
  startTime: '',
  total: 0,
}
Autocompleter.propTypes = {
  canCreateNewPerson: PropTypes.bool,
  id: PropTypes.string,
  isSelectable: PropTypes.func,
  // onSelect: PropTypes.func.isRequired,
  results: PropTypes.array,
  searchTerm: PropTypes.string,
  staffId: PropTypes.string,
  startTime: PropTypes.string,
  total: PropTypes.number,
}

Autocompleter.displayName = 'Autocompleter'
