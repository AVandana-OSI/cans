import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import Autocomplete from 'react-autocomplete'
import SuggestionHeader from '../common/search/SuggestionHeader'
import PersonSuggestion from '../common/search/PersonSuggestion'
import SearchPagination from '../common/search/SearchPagination'
import { trimSafely } from '../../util/formatters'

const MIN_SEARCHABLE_CHARS = 2
const disablePagination = true

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
      pagination: {
        disable: disablePagination,
      },
      redirection: {
        shouldRedirect: false,
        legacyId: null,
        selectedClient: null,
      },
    }

    this.onFocus = this.onFocus.bind(this)
    this.hideMenu = this.hideMenu.bind(this)
    this.onItemSelect = this.onItemSelect.bind(this)
    this.renderMenu = this.renderMenu.bind(this)
    this.onChangeInput = this.onChangeInput.bind(this)
    this.renderItem = this.renderItem.bind(this)

    this.changePage = this.changePage.bind(this)
  }
  hideMenu() {
    if (this.inputRef) {
      this.inputRef.setAttribute('aria-activedescendant', '')
    }
    this.setState({ menuVisible: false })
  }
  isSearchable(value) {
    return value && value.replace(/^\s+/, '').length >= MIN_SEARCHABLE_CHARS
  }
  onSelect(item) {
    // if we didn't select the suggestion header or footer, then redirect
    if (!item.suggestionHeader && !item.suggestionFooter) {
      this.setState({
        redirection: {
          shouldRedirect: true,
          selectedClient: item,
          legacyId: item.legacy_id,
        },
      })
    }
  }
  onItemSelect(_value, item) {
    this.onSelect(item)
  }
  onFocus() {
    if (this.isSearchable(this.state.searchTerm)) {
      this.setState({ menuVisible: true })
    } else {
      this.hideMenu()
    }
  }
  changePage(currentPage, direction) {
    const { searchTerm } = this.state

    if (direction === 'prev') {
      // get the previous set of clients from this.props.results
    } else if (direction === 'next') {
      const { results } = this.props
      const numResults = results.length
      const sortAfter = results[numResults - 1].sort

      // get the next set of clients from Dora
      this.props.debounce(searchTerm, sortAfter)
    }
  }
  renderMenu(items, _searchTerm, _style) {
    return <div className="autocomplete-menu">{items}</div>
  }
  renderEachItem(item, id, isHighlighted) {
    const { searchTerm, pagination } = this.state
    const key = `${item.posInSet}-of-${item.setSize}`

    if (item.suggestionHeader) {
      return (
        <div id={id} className={'suggestion-header-wrapper'} key={key} aria-live="polite">
          <SuggestionHeader
            currentNumberOfResults={this.props.totalResults}
            total={this.props.totalResults}
            searchTerm={searchTerm}
          />
        </div>
      )
    }
    if (item.suggestionFooter) {
      return (
        <div id={id} key={key} className="suggestion-footer-wrapper">
          <SearchPagination
            key={pagination.currentPage}
            changePage={this.changePage}
            totalResults={this.props.totalResults}
            disable={pagination.disable}
          />
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
    const key = `${item.posInSet}-of-${item.setSize}`
    const id = `search-result-${key}`

    return this.renderEachItem(item, id, isHighlighted)
  }
  onChangeInput(_, searchTerm) {
    const trimmedSearchTerm = trimSafely(searchTerm)

    if (this.isSearchable(trimSafely(trimmedSearchTerm))) {
      this.setState({ searchTerm, menuVisible: true })
      this.props.debounce(trimmedSearchTerm)
    } else {
      this.hideMenu()
      this.props.onClear()
      this.setState({ searchTerm })
    }
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
  renderAutocomplete() {
    const { results, id } = this.props
    if (results.length > 0) {
      addPosAndSetAttr(results) // Sequentually numbering items ***
    }
    const suggestionHeader = [
      {
        suggestionHeader: 'suggestion Header',
        fullName: '',
        posInSet: 'header',
        setSize: results.length,
      },
    ]
    const suggestionFooter = [
      {
        suggestionFooter: 'suggestion Footer',
        posInSet: 'footer',
        setSize: results.length,
      },
    ]
    const newResults = suggestionHeader.concat(results).concat(suggestionFooter)
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
      />
    )
  }
  render() {
    const { redirection } = this.state
    const { shouldRedirect, legacyId } = redirection

    if (shouldRedirect) {
      return (
        <Redirect
          push
          to={{
            pathname: `clients/${legacyId}`,
            state: { isNewForm: true, legacyId },
          }}
        />
      )
    }

    return this.renderAutocomplete()
  }
}

Autocompleter.defaultProps = {
  debounce: () => {},
  onClear: () => {},
  results: [],
  totalResults: 0,
  totalPages: 0,
}

Autocompleter.propTypes = {
  debounce: PropTypes.func,
  id: PropTypes.string.isRequired,
  onClear: PropTypes.func,
  results: PropTypes.array,
  totalPages: PropTypes.number,
  totalResults: PropTypes.number,
}

Autocompleter.displayName = 'Autocompleter'
