import React from 'react'
import classnames from 'classnames'
import PaginationRT from 'react-table/lib/pagination'
import Select from '@cwds/components/lib/Select'
import Input from '@cwds/components/lib/Input'
import { isFirefox } from '../../../util/common'
import uniqueId from 'lodash.uniqueid'

/**
 * Replacing Pagination from @cwds/components library to solve issue
 * with FireFox losing a focus in page jump input field when it is empty.
 *
 * From react-table@6.8.6 with Firefox fix
 * See https://github.com/react-tools/react-table/blob/f55ce620411c619855a2fe2f081407e4f82727b9/src/pagination.js
 */
class Pagination extends PaginationRT {
  uniqueId = uniqueId('datagrid_pagination_')
  render() {
    const {
      // Computed
      pages,
      // Props
      page,
      showPageSizeOptions,
      pageSizeOptions,
      pageSize,
      showPageJump,
      canPrevious,
      canNext,
      onPageSizeChange,
      className,
      PreviousComponent,
      NextComponent,
    } = this.props

    return (
      <div className={classnames(className, '-pagination')} style={this.props.style}>
        <div className="-previous">
          <PreviousComponent
            onClick={() => {
              if (!canPrevious) return
              this.changePage(page - 1)
            }}
            disabled={!canPrevious}
          >
            {this.props.previousText}
          </PreviousComponent>
        </div>
        <div className="-center">
          <span className="-pageInfo d-none d-md-inline">
            {this.props.pageText}{' '}
            {showPageJump ? (
              <div className="-pageJump">
                <label className="sr-only" htmlFor={`${this.uniqueId}_pageJump`}>
                  Page Jump
                </label>
                <Input
                  id={`${this.uniqueId}_pageJump`}
                  type={!isFirefox && this.state.page === '' ? 'text' : 'number'}
                  onChange={e => {
                    const { value, valueAsNumber } = e.target
                    if (isFirefox && isNaN(valueAsNumber)) {
                      return this.setState({ page: valueAsNumber })
                    }
                    if (value === '') {
                      return this.setState({ page: value })
                    }
                    const page = value - 1
                    return this.setState({ page: this.getSafePage(page) })
                  }}
                  value={this.state.page === '' ? '' : this.state.page + 1}
                  onBlur={this.applyPage}
                  onKeyPress={e => {
                    if (e.which === 13 || e.keyCode === 13) {
                      this.applyPage()
                    }
                  }}
                />
              </div>
            ) : (
              <span className="-currentPage">{page + 1}</span>
            )}{' '}
            {this.props.ofText} <span className="-totalPages">{pages || 1}</span>
          </span>
          {showPageSizeOptions && (
            <div className="select-wrap -pageSizeOptions">
              <Select
                value={pageSize}
                style={{
                  textAlign: 'left',
                }}
                options={pageSizeOptions.map(option => ({
                  value: option,
                  label: `${option} ${this.props.rowsText}`,
                }))}
                onChange={({ value }) => onPageSizeChange(Number(value))}
                clearable={false}
                searchable={false}
              />
            </div>
          )}
        </div>
        <div className="-next">
          <NextComponent
            onClick={() => {
              if (!canNext) return
              this.changePage(page + 1)
            }}
            disabled={!canNext}
          >
            {this.props.nextText}
          </NextComponent>
        </div>
      </div>
    )
  }
}

export default Pagination
