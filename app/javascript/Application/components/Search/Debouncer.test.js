import React from 'react'
import { shallow, mount } from 'enzyme'
import Debouncer from './Debouncer'

const MyComponent = () => <div>Hello World</div>

describe('<Debouncer />', () => {
  const render = child => {
    return mount(<Debouncer>{child}</Debouncer>)
  }

  describe('page layout', () => {
    it('renders a child component', () => {
      const wrapper = render(<MyComponent />)

      expect(wrapper.find(MyComponent).exists()).toBe(true)
      expect(wrapper.find(MyComponent).text()).toBe('Hello World')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    describe('calls debounce one time', () => {
      it('waits 400 milliseconds after the last call to search for clients', () => {
        const wrapper = render(<MyComponent />)
        const debounceSpy = jest.spyOn(Debouncer.prototype, 'debounce')
        wrapper.instance().debounce('annie')

        expect(clearTimeout).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 400)
      })
    })

    describe('calls debounce twice', () => {
      it('waits 400 milliseconds after the last call to search for clients', () => {
        const wrapper = render(<MyComponent />)
        const debounceSpy = jest.spyOn(Debouncer.prototype, 'debounce')
        wrapper.instance().debounce('george')
        wrapper.instance().debounce('annie')

        expect(clearTimeout).toHaveBeenCalledTimes(2)
        expect(setTimeout).toHaveBeenCalledTimes(2)
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 400)
      })
    })
  })

  describe('onClear', () => {
    it('clears state when onClear is called', () => {
      const onClearSpy = jest.spyOn(Debouncer.prototype, 'onClear')
      const wrapper = render(<MyComponent />)
      wrapper.setState({
        results: ['result 1', 'result 2'],
        totalPages: 10,
        totalResults: 100,
      })
      wrapper.instance().onClear()
      const afterState = {
        results: [],
        totalPages: 0,
        totalResults: 0,
      }

      expect(wrapper.state()).toEqual(afterState)
    })
  })
})
