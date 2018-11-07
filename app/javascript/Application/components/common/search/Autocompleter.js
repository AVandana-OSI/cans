import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import Autocomplete from 'react-autocomplete'
import SuggestionHeader from './SuggestionHeader'
import PersonSuggestion from './PersonSuggestion'

const MIN_SEARCHABLE_CHARS = 2

const addPosAndSetAttr = results => {
  const one = 1
  for (let len = results.length, i = 0; i < len; ++i) {
    results[i].posInSet = i + one
    results[i].setSize = len
  }
}

const itemClassName = isHighlighted =>
  `search-item${isHighlighted ? ' highlighted-search-item' : ''}`

export default class Autocompleter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuVisible: true,
      // menuVisible: false,
      searchTerm: '',
      redirection: {
        shouldRedirect: false,
        legacyId: null,
        selectedClient: null,
      },
    }

    this.timer = null

    this.onFocus = this.onFocus.bind(this)
    this.hideMenu = this.hideMenu.bind(this)
    this.onItemSelect = this.onItemSelect.bind(this)
    this.renderMenu = this.renderMenu.bind(this)
    this.onChangeInput = this.onChangeInput.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.isSelectable = this.isSelectable.bind(this)
    this.shouldItemRender = this.shouldItemRender.bind(this)
  }

  isSearchable(value) {
    return value && value.replace(/^\s+/, '').length >= MIN_SEARCHABLE_CHARS
  }

  hideMenu() {
    if (this.inputRef) {
      this.inputRef.setAttribute('aria-activedescendant', '')
    }
    this.setState({ menuVisible: true })
    // this.setState({ menuVisible: false })
  }

  isSelectable(person) {
    return person.isSealed
    // canUserAddClient(userInfo, hasAddSensitivePerson, person, hasOverride);
  }

  onSelect(item) {
    // if we clicked on the suggestion header, don't redirect
    if (!item.suggestionHeader) {
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
    if (this.isSelectable(item)) {
      window.alert('You are not authorized to add this person.') // eslint-disable-line no-alert
      return
    }
    this.onSelect(item)
  }

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
    const { results } = this.props
    const totalResults = results.length
    const searchTerm = this.state.searchTerm

    const key = `${item.posInSet}-of-${item.setSize}`
    if (item.suggestionHeader) {
      return (
        <div
          id={id}
          className={'suggestion-header-wrapper'}
          key={key}
          aria-live="polite"
        >
          <SuggestionHeader
            currentNumberOfResults={totalResults}
            total={totalResults}
            searchTerm={searchTerm}
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
    this.setState({ searchTerm })
    if (this.isSearchable(searchTerm)) {
      this.setState({ menuVisible: true })
      this.props.debounce(searchTerm)
    } else {
      this.hideMenu()
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

  shouldItemRender(item, searchTerm) {
    if (item.suggestionHeader) {
      return true
    } else if (
      item.fullName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    ) {
      return true
    } else {
      return false
    }
  }

  renderAutocomplete() {
    const { results } = this.props
    addPosAndSetAttr(results) // Sequentually numbering items ***
    console.log(results)
    const { id } = this.props
    const suggestionHeader = [
      { suggestionHeader: 'suggestion Header', fullName: '' },
    ]
    const newResults = suggestionHeader.concat(results)

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

Autocompleter.propTypes = {
  id: PropTypes.string.isRequired,
}

Autocompleter.displayName = 'Autocompleter'
