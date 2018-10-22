import React from 'react'
import { shallow } from 'enzyme'
import App from './App'
import Header from './components/Header/'
import { PageHeader } from 'react-wood-duck'
import { Routes } from './routes'

describe('<App />', () => {
  const getWrapper = () => shallow(<App />)
  const getLength = component => getWrapper().find(component).length

  it('renders with <Header /> component', () => {
    expect(getLength(Header)).toBe(1)
  })

  it('renders with <PageHeader /> component', () => {
    expect(getLength(PageHeader)).toBe(1)
  })

  it('renders with <Routes /> component', () => {
    const wrapper = getWrapper()
    expect(wrapper.find(Routes).length).toBe(1)
  })
})
