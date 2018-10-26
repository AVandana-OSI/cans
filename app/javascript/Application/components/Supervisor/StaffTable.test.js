import React from 'react'
import { shallow } from 'enzyme'
import DataGrid from '@cwds/components/lib/DataGrid'
import StaffTable from './StaffTable'
import { staff as mockStaff } from './staff.mocks.test'

describe('<StaffTable />', () => {
  const render = staff => shallow(<StaffTable staff={staff} />)

  it('renders a DataGrid', () => {
    expect(
      render([])
        .find(DataGrid)
        .exists()
    ).toBe(true)
  })

  it('shows all rows without pagination', () => {
    const grid = render([]).find(DataGrid)
    expect(grid.props().showPagination).toBe(false)
    expect(grid.props().defaultPageSize).toBe(1000)
    expect(grid.props().minRows).toBe(3)
  })

  it('sorts by staffName by default', () => {
    const grid = render([]).find(DataGrid)
    expect(grid.props().defaultSorted).toEqual([{ id: 'staffName' }])
  })

  it('uses the list of staff people as data', () => {
    const grid = render(mockStaff)
    expect(grid.props().data).toBe(mockStaff)
  })

  it('centers the Total Clients column', () => {
    const columns = render([]).props().columns
    const totalColumn = columns.find(column => column.Header === 'Total Clients')
    expect(totalColumn.className).toBe('text-center')
    expect(totalColumn.headerClassName).toBe('text-center')
  })

  it('centers the In Progress column', () => {
    const columns = render([]).props().columns
    const progressColumn = columns.find(column => column.Header === 'In Progress')
    expect(progressColumn.className).toBe('text-center')
    expect(progressColumn.headerClassName).toBe('text-center')
  })
})
