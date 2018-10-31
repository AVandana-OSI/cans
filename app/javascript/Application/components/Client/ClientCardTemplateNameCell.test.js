import React from 'react'
import { shallow } from 'enzyme'
import ClientCardTemplateNameCell from './ClientCardTemplateNameCell'

const fakeProp = {
  original: {
    external_id: '01',
  },
  value: 'foo',
}

describe('<ClientCardTemplateNameCell />', () => {
  it('returns a link with external_id', () => {
    let wrapper = shallow(<ClientCardTemplateNameCell {...fakeProp} />)
    expect(wrapper.find('a').html()).toEqual('<a href="/cans/clients/01">foo</a>')
  })
})
