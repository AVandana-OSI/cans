import React from 'react'
import { render } from 'enzyme'
import ClientCardTemplateNameCell from './ClientCardTemplateNameCell'
import { BrowserRouter } from 'react-router-dom'

const fakeProp = {
  original: {
    identifier: '0X5',
  },
  value: 'foo',
}

describe('<ClientCardTemplateNameCell />', () => {
  it('returns a link with identifier', () => {
    let wrapper = render(
      <BrowserRouter>
        <ClientCardTemplateNameCell {...fakeProp} />
      </BrowserRouter>
    )
    expect(wrapper.find('#ClientName')._root[0].attribs.href).toContain('/clients/0X5')
  })
})
