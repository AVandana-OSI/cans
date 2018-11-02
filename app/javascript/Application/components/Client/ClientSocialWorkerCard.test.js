import React from 'react'
import { shallow } from 'enzyme'
import { Card, CardHeader, CardBody } from '@cwds/components/lib/Cards'
import CardTitle from '@cwds/components/lib/Cards/CardTitle'
import DataGrid from '@cwds/components/lib/DataGrid'
import ClientSocialWorkerCard from './ClientSocialWorkerCard'
import { SocialWorkerCardTemplate } from './ClientSocialWorkerCardTemplate'
import { socialWorkerClientsJson } from './Client.helper.test'

describe('<ClientSocialWorkerCard />', () => {
  const fakProps = {
    title: 100,
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

  it('Card, CardHeader, CardTitle, CardBody, and DataGrid should be rendered', () => {
    expect(wrapper.find(Card).exists()).toBe(true)
    expect(wrapper.find(CardHeader).exists()).toBe(true)
    expect(wrapper.find(CardTitle).exists()).toBe(true)
    expect(wrapper.find(CardBody).exists()).toBe(true)
    expect(wrapper.find(DataGrid).exists()).toBe(true)
  })

  it('Card header will be rendered with fakeTitle', () => {
    expect(wrapper.find(CardHeader).html()).toContain(100)
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
