import React from 'react'
import { shallow } from 'enzyme'
import SearchPagination from './SearchPagination'

describe('SearchPagination', () => {
  describe('init SearchPagination', () => {
    describe('page layout', () => {
      it('renders a suggestion-footer div', () => {
        const props = { totalResults: 2, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)

        expect(wrapper.find('div.suggestion-footer').length).toBe(1)
      })

      it('renders a pagination wrapper div', () => {
        const props = { totalResults: 2, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)

        expect(wrapper.find('div.pagination-wrapper').length).toBe(1)
      })

      it('renders a prev-page button', () => {
        const props = { totalResults: 12, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)

        expect(wrapper.find('button.prev-page').length).toBe(1)
      })

      it('renders a prev-page button that is disabled', () => {
        const props = { totalResults: 100, changePage: () => {}, disable: true }
        const wrapper = shallow(<SearchPagination {...props} />)

        expect(wrapper.find('button.prev-page').props().disabled).toBe(true)
      })

      it('renders a font awesome caret left icon inside the prev-page button', () => {
        const props = { totalResults: 24, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)

        expect(wrapper.find('button.prev-page').find('i.fa-caret-left').length).toBe(1)
      })

      it('renders a current-page-number input', () => {
        const props = { totalResults: 36, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)
        expect(wrapper.find('input.current-page-number').length).toBe(1)
      })

      it('renders a current-page-number input that is disabled', () => {
        const props = { totalResults: 36, changePage: () => {}, disable: true }
        const wrapper = shallow(<SearchPagination {...props} />)

        expect(wrapper.find('input.current-page-number').props().disabled).toBe(true)
      })

      it('renders a current-page-number input that is readonly', () => {
        const props = { totalResults: 9, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)

        expect(wrapper.find('input.current-page-number').props().readOnly).toBe(true)
      })

      it('renders a total-pages-wrapper div', () => {
        const props = { totalResults: 48, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)

        expect(wrapper.find('div.total-pages-wrapper').length).toBe(1)
      })

      it('renders a total-pages span inside a total-pages-wrapper div', () => {
        const props = { totalResults: 24, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)
        expect(wrapper.find('div.total-pages-wrapper').find('span.total-pages').length).toBe(1)
      })

      it('renders a next-page button', () => {
        const props = { totalResults: 12, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)

        expect(wrapper.find('button.next-page').length).toBe(1)
      })

      it('renders a next-page button that is disabled', () => {
        const props = { totalResults: 100, changePage: () => {}, disable: true }
        const wrapper = shallow(<SearchPagination {...props} />)

        expect(wrapper.find('button.next-page').props().disabled).toBe(true)
      })

      it('renders a font awesome caret right icon inside the next page button', () => {
        const props = { totalResults: 24, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)

        expect(wrapper.find('button.next-page').find('i.fa-caret-right').length).toBe(1)
      })

      it('renders nothing when total results is zero', () => {
        const props = { totalResults: 0, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)

        expect(wrapper.html()).toBe(null)
      })
    })
  })

  describe('renders pagination info', () => {
    describe('current page number information', () => {
      it('renders an input that has a value of 1 when total results is greater than 0', () => {
        const props = { totalResults: 9, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)

        expect(wrapper.find('input.current-page-number').props().value).toBe(1)
      })
    })

    describe('total page number information', () => {
      it('total pages to be 25 when total results equals 245', () => {
        const props = {
          totalResults: 245,
          changePage: () => {},
          disable: false,
        }
        const wrapper = shallow(<SearchPagination {...props} />)

        expect(wrapper.find('span.total-pages').html()).toBe('<span class="total-pages">25</span>')
      })
    })
  })

  describe('prev page button', () => {
    describe('when on the first page', () => {
      it('should not update the current page when clicked', () => {
        const props = { totalResults: 11, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)

        const button = wrapper.find('button.prev-page')
        button.simulate('click')

        expect(wrapper.state().pagination.currentPage).toBe(1)
      })

      it('should not call getPrevPage when clicked', () => {
        const props = { totalResults: 12, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)
        const spy = jest.spyOn(wrapper.instance(), 'getPrevPage')

        const button = wrapper.find('button.prev-page')
        button.simulate('click')

        expect(spy).not.toHaveBeenCalled()
      })

      it('should be disabled', () => {
        const props = { totalResults: 11, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)

        const button = wrapper.find('button.prev-page')

        expect(button.props().disabled).toBe(true)
      })
    })

    describe('when on the second page', () => {
      it('should update the current page when clicked', () => {
        const props = { totalResults: 11, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)
        wrapper.setState({ pagination: { currentPage: 2, totalPages: 2 } })

        const button = wrapper.find('button.prev-page')
        button.simulate('click')

        expect(wrapper.state().pagination.currentPage).toBe(1)
      })

      it('should call getPrevPage when clicked', () => {
        const props = { totalResults: 12, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)
        const spy = jest.spyOn(wrapper.instance(), 'getPrevPage')
        wrapper.setState({ pagination: { currentPage: 2, totalPages: 2 } })

        const button = wrapper.find('button.prev-page')
        button.simulate('click')

        expect(spy).toHaveBeenCalled()
      })

      it('should not be disabled', () => {
        const props = { totalResults: 11, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)
        wrapper.setState({ pagination: { currentPage: 2, totalPages: 2 } })

        const button = wrapper.find('button.prev-page')

        expect(button.props().disabled).toBe(false)
      })
    })
  })

  describe('next page button', () => {
    describe('when on the first page', () => {
      it('should update the current page', () => {
        const props = { totalResults: 11, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)

        const button = wrapper.find('button.next-page')
        button.simulate('click')

        expect(wrapper.state().pagination.currentPage).toBe(2)
      })

      it('should call getNextPage when clicked', () => {
        const props = { totalResults: 12, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)
        const spy = jest.spyOn(wrapper.instance(), 'getNextPage')

        const button = wrapper.find('button.next-page')
        button.simulate('click')

        expect(spy).not.toHaveBeenCalled()
      })

      it('should not be disabled', () => {
        const props = { totalResults: 11, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)

        const button = wrapper.find('button.next-page')

        expect(button.props().disabled).toBe(false)
      })
    })

    describe('when on the last page', () => {
      it('should not update the current page', () => {
        const props = { totalResults: 11, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)
        wrapper.setState({ pagination: { currentPage: 2, totalPages: 2 } })

        const button = wrapper.find('button.next-page')
        button.simulate('click')

        expect(wrapper.state().pagination.currentPage).toBe(2)
      })

      it('should not call getNextPage when clicked', () => {
        const props = { totalResults: 12, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)
        const spy = jest.spyOn(wrapper.instance(), 'getNextPage')
        wrapper.setState({ pagination: { currentPage: 2, totalPages: 2 } })

        const button = wrapper.find('button.prev-page')
        button.simulate('click')

        expect(spy).not.toHaveBeenCalled()
      })

      it('should be disabled', () => {
        const props = { totalResults: 15, changePage: () => {}, disable: false }
        const wrapper = shallow(<SearchPagination {...props} />)
        wrapper.setState({ pagination: { currentPage: 2, totalPages: 2 } })

        const button = wrapper.find('button.next-page')

        expect(button.props().disabled).toBe(true)
      })
    })
  })
})
