import React from 'react'
import { shallow } from 'enzyme'
import Card from '@material-ui/core/Card/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import DataGrid from '@cwds/components/lib/DataGrid'
import ClientSocialWorkerCard from './ClientSocialWorkerCard'
import { SocialWorkerCardTemplate } from './ClientSocialWorkerCardTemplate'
import { socialWorkerClientsJson } from './Client.helper.test'

describe('<ClientSocialWorkerCard />', () => {
  let fakProps = {
    title: { type: 'object' },
    data: socialWorkerClientsJson,
    columns: SocialWorkerCardTemplate(),
    defaultSorted: [
      {
        id: 'fullName',
        asc: true,
      },
    ],
    loading: false,
  }
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<ClientSocialWorkerCard {...fakProps} />)
  })

  it('Card, CardHeader, CardContent, and DataGrid should be rendered', () => {
    expect(wrapper.find(Card).exists()).toBe(true)
    expect(wrapper.find(CardHeader).exists()).toBe(true)
    expect(wrapper.find(CardContent).exists()).toBe(true)
    expect(wrapper.find(DataGrid).exists()).toBe(true)
  })

  it('Card header will be rendered with fakeTitle', () => {
    expect(wrapper.find(CardHeader).getElement().props.title).toEqual({ type: 'object' })
  })

  it('DataGrid should be rendered with some important props', () => {
    const table = wrapper.find(DataGrid)
    expect(table.props().sortable).toBe(true)
    expect(table.props().showPaginationBottom).toBe(true)
    expect(table.props().columns.length).toBe(4)
    expect(table.props().data.length).toBe(5)
    expect(table.props().defaultSorted[0].asc).toBe(true)
  })
})
