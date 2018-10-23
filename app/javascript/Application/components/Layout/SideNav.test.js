import React from 'react'
import { shallow } from 'enzyme'
import { SideNav, SideNavLink } from './index'

const getWrapper = () => shallow(<SideNav />)

describe('the <SideNav /> view', () => {
  const getLength = element => getWrapper().find(element).length

  it('renders with a <nav /> element', () => {
    expect(getLength('nav')).toBe(1)
  })

  it('renders with 2 <SideNavLink /> component', () => {
    expect(getLength(SideNavLink)).toBe(2)
  })
})

describe('toggleActiveLink', () => {
  it('should correctly assign the href passed in to state', () => {
    const wrapper = getWrapper()
    expect(wrapper.state().activeLink).toEqual('')
    wrapper.instance().toggleActiveLink('/this-url')
    expect(wrapper.state().activeLink).toEqual('/this-url')
    expect(wrapper.state().activeLink).not.toEqual('/another-url')
  })

  it('should change activeLink state onClick', () => {
    const wrapper = getWrapper()
    expect(wrapper.state().activeLink).toEqual('')
    wrapper.find('[text="County Client List"]').simulate('click')
    expect(wrapper.state().activeLink).toEqual('/')
  })
})

describe('isActive', () => {
  it('should correctly evaluate state', () => {
    const wrapper = getWrapper()
    wrapper.setState({ activeLink: '/this-url' })
    expect(wrapper.state().activeLink).toEqual('/this-url')
    expect(wrapper.instance().isActive('/this-url')).toEqual(true)
    expect(wrapper.instance().isActive('/that-url')).toEqual(false)
  })
})
