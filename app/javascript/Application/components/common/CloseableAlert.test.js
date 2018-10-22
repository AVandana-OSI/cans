import React from 'react'
import { CloseableAlert } from './index'
import { shallow } from 'enzyme'

jest.useFakeTimers()

describe('<CloseableAlert>', () => {
  describe('render', () => {
    it('has a message and no close button', () => {
      // given + when
      const alert = shallow(<CloseableAlert message={'welcome'} type={'info'} />)

      // then
      expect(alert.render().text()).toBe('welcome')
      expect(alert.find('.close-icon').length).toBe(0)
    })

    it('has a close icon when needed', () => {
      // given + when
      const alert = shallow(<CloseableAlert isCloseable={true} type={'info'} message={''} />)

      // then
      expect(alert.find('.close-icon').length).toBe(1)
    })
  })

  describe('closability', () => {
    it('is hidden in closed state', () => {
      // given
      const alert = shallow(<CloseableAlert message={'welcome'} type={'info'} />)

      // when
      alert.instance().setState({ isClosed: true })
      alert.update()

      // then
      expect(alert.render().text()).toBe('')
    })

    it('hides on close icon click', () => {
      // given
      const alert = shallow(<CloseableAlert message={'welcome'} isCloseable={true} type={'info'} />)
      expect(alert.render().text()).toBe('welcome')

      // when
      alert.find('.close-icon').simulate('click')
      alert.update()

      // then
      expect(alert.render().text()).toBe('')
    })

    it('hides automatically on timeout when auto closeable', () => {
      // given
      const alert = shallow(<CloseableAlert message={'welcome'} isAutoCloseable={true} type={'info'} />)
      expect(alert.render().text()).toBe('welcome')

      // when
      jest.runAllTimers()
      alert.update()

      // then
      expect(alert.render().text()).toBe('')
    })

    it('invokes onClose callback if it exists', () => {
      // given
      const onCloseCallback = jest.fn()
      const alert = shallow(
        <CloseableAlert onClose={onCloseCallback} isAutoCloseable={true} message={''} type={'info'} />
      )

      // when
      jest.runAllTimers()
      alert.update()

      // then
      expect(onCloseCallback).toHaveBeenCalledWith()
    })
  })
})
