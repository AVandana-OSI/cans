import React from 'react'
import { shallow } from 'enzyme'
import Pagination from './Pagination'
import Input from '@cwds/components/lib/Input'
import Select from '@cwds/components/lib/Select'
import PaginationButtonFactory from './PaginationButtonFactory'
import * as common from '../../../util/common'

describe('<Pagination />', () => {
  const defaultProps = {
    pages: 3,
    page: 1,
    showPageSizeOptions: true,
    pageSizeOptions: ['10', '20'],
    pageSize: 10,
    showPageJump: true,
    canPrevious: true,
    canNext: true,
    onPageSizeChange: () => {},
    onPageChange: () => {},
    PreviousComponent: PaginationButtonFactory('left'),
    NextComponent: PaginationButtonFactory('right'),
  }

  describe('PreviousComponent', () => {
    it('should change current page on button click', () => {
      // given
      const pagination = shallow(<Pagination {...defaultProps} />)
      const previousComponent = pagination
        .find('.-previous')
        .children()
        .dive()
      const previousComponentButton = previousComponent.find('withCssModule(Button)').dive()

      // when
      previousComponentButton.simulate('click')

      // then
      expect(pagination.instance().state.page).toBe(0)
    })

    it('should ignore click if no previous page', () => {
      // given
      const onPageChangeMock = jest.fn()
      const props = { ...defaultProps, canPrevious: false, onPageChange: onPageChangeMock }
      const pagination = shallow(<Pagination {...props} />)
      const previousComponent = pagination
        .find('.-previous')
        .children()
        .dive()
      const previousComponentButton = previousComponent.find('withCssModule(Button)').dive()

      // when
      previousComponentButton.simulate('click')

      // then
      expect(onPageChangeMock).not.toHaveBeenCalled()
    })
  })

  describe('center bar', () => {
    describe('page jump input field', () => {
      it('should hide when showPageJump prop is false', () => {
        const props = { ...defaultProps, showPageJump: false }
        const pagination = shallow(<Pagination {...props} />)
        expect(pagination.find(Input).length).toBe(0)
      })

      it('should display total pages as 1 if undefined', () => {
        const props = { ...defaultProps, pages: undefined }
        const pagination = shallow(<Pagination {...props} />)
        expect(pagination.find('.-totalPages').text()).toBe('1')
      })

      describe('when changed', () => {
        it('should change page in state', () => {
          // given
          const pagination = shallow(<Pagination {...defaultProps} />)
          const input = pagination.find(Input).dive()

          // when
          input.instance().props.onChange({ target: { value: 2 } })

          // then
          expect(pagination.instance().state.page).toBe(1)
        })

        it('should change page in state to NaN if NaN input in Firefox', () => {
          common.isFirefox = true
          const pagination = shallow(<Pagination {...defaultProps} />)
          const input = pagination.find(Input).dive()

          // when
          input.instance().props.onChange({ target: { valueAsNumber: NaN } })

          // then
          expect(pagination.instance().state.page).toBe(NaN)
        })

        it('should change page in state to empty string if empty input', () => {
          // given
          common.isFirefox = false
          const pagination = shallow(<Pagination {...defaultProps} />)
          const input = pagination.find(Input).dive()

          // when
          input.instance().props.onChange({ target: { value: '' } })

          // then
          expect(pagination.instance().state.page).toBe('')
          expect(input.props().type).toBe('number')
        })
      })

      describe('key pressed', () => {
        describe('when Enter key pressed', () => {
          it('should change page in state and call onPageChange callback', () => {
            // given
            const onPageChangeMock = jest.fn()
            const props = { ...defaultProps, onPageChange: onPageChangeMock }
            const pagination = shallow(<Pagination {...props} />)
            pagination.instance().setState({ page: 2 })
            const input = pagination.find(Input).dive()

            // when
            input.instance().props.onKeyPress({ keyCode: 13 })

            // then
            expect(pagination.instance().state.page).toBe(2)
            expect(onPageChangeMock).toHaveBeenCalledWith(2)
          })

          it('should change page in state and call onPageChange callback 2', () => {
            // given
            const onPageChangeMock = jest.fn()
            const props = { ...defaultProps, onPageChange: onPageChangeMock }
            const pagination = shallow(<Pagination {...props} />)
            pagination.instance().setState({ page: 2 })
            const input = pagination.find(Input).dive()

            // when
            input.instance().props.onKeyPress({ which: 13 })

            // then
            expect(pagination.instance().state.page).toBe(2)
            expect(onPageChangeMock).toHaveBeenCalledWith(2)
          })
        })

        describe('when any other key pressed', () => {
          it('should ignore', () => {
            // given
            const onPageChangeMock = jest.fn()
            const props = { ...defaultProps, onPageChange: onPageChangeMock }
            const pagination = shallow(<Pagination {...props} />)
            const input = pagination.find(Input).dive()

            // when
            input.instance().props.onKeyPress({ keyCode: 14 })

            // then
            expect(onPageChangeMock).not.toHaveBeenCalled()
          })
        })
      })
    })

    describe('page size select field', () => {
      it('should hide when showPageSizeOptions prop is false', () => {
        const props = { ...defaultProps, showPageSizeOptions: false }
        const pagination = shallow(<Pagination {...props} />)
        expect(pagination.find(Select).length).toBe(0)
      })

      it('should invoke onPageSizeChange callback on change', () => {
        // given
        const onPageSizeChangeMock = jest.fn()
        const props = { ...defaultProps, onPageSizeChange: onPageSizeChangeMock }
        const pagination = shallow(<Pagination {...props} />)
        const select = pagination.find(Select).dive()

        // when
        select.instance().props.onChange({ value: '20' })

        // then
        expect(onPageSizeChangeMock).toHaveBeenCalledWith(20)
      })
    })
  })

  describe('NextComponent', () => {
    it('should change current page on button click', () => {
      // given
      const pagination = shallow(<Pagination {...defaultProps} />)
      const nextComponent = pagination
        .find('.-next')
        .children()
        .dive()
      const nextComponentButton = nextComponent.find('withCssModule(Button)').dive()

      // when
      nextComponentButton.simulate('click')

      // then
      expect(pagination.instance().state.page).toBe(2)
    })

    it('should ignore click if no next page', () => {
      // given
      const onPageChangeMock = jest.fn()
      const props = { ...defaultProps, canNext: false, onPageChange: onPageChangeMock }
      const pagination = shallow(<Pagination {...props} />)
      const nextComponent = pagination
        .find('.-next')
        .children()
        .dive()
      const nextComponentButton = nextComponent.find('withCssModule(Button)').dive()

      // when
      nextComponentButton.simulate('click')

      // then
      expect(onPageChangeMock).not.toHaveBeenCalled()
    })
  })
})
