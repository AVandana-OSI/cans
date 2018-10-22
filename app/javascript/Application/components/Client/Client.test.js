import React from 'react'
import { shallow } from 'enzyme'
import { Client } from './index'
import Card from '@material-ui/core/Card/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import { PageInfo } from '../Layout'
import { MemoryRouter } from 'react-router-dom'

const client = {
  id: 1,
  first_name: 'test',
  middle_name: 'name',
  last_name: 'user',
  suffix: 'Mr.',
  dob: '1980-01-02',
  external_id: '1234567891234567890',
  county: { name: 'Sacramento' },
  cases: [],
  sensitivity_type: null,
}

const params = {
  match: { params: { id: '1' } },
  location: { pathname: 'client' },
  history: { location: '/client' },
  client,
}

describe('<Client />', () => {
  describe('initial component layout', () => {
    const getWrapper = () => shallow(<Client {...params} />)
    const getLength = component => getWrapper().find(component).length

    it('renders with 1 <Card /> component', () => {
      expect(getLength(Card)).toBe(1)
    })

    it('renders with 1 <CardHeader /> component', () => {
      expect(getLength(CardHeader)).toBe(1)
    })

    it('renders with <CardContent /> component', () => {
      expect(getLength(CardContent)).toBe(1)
    })

    it('renders with <PageInfo /> component', () => {
      expect(getLength(PageInfo)).toBe(1)
    })
  })

  describe('with no childData', () => {
    const params = {
      match: { params: { id: '1' } },
      location: { pathname: 'client' },
      history: { location: '/client' },
    }

    const getWrapper = () => shallow(<Client {...params} />)
    const getLength = component => getWrapper().find(component).length

    it('renders with 2 <Grid /> components', () => {
      expect(getLength(Grid)).toBe(2)
    })

    it('renders No Child Data Found', () => {
      expect(getLength('#no-data')).toBe(1)
    })
  })

  describe('with childData', () => {
    let wrapper = {}
    beforeEach(() => {
      wrapper = clientWrapper(params)
    })

    const clientWrapper = params => {
      return shallow(
        <MemoryRouter>
          <Client {...params} />
        </MemoryRouter>
      )
        .find(Client)
        .dive()
    }

    const getLength = component => wrapper.find(component).length

    it('renders with 12 <Grid /> components', () => {
      expect(getLength(Grid)).toBe(12)
    })

    it('renders with 9 ".label-text" styled elements', () => {
      expect(getLength('.label-text')).toBe(9)
    })

    it('does not render No Child Data Found', () => {
      expect(getLength('#no-data')).not.toBe(1)
    })

    it('date of birth rendered properly', () => {
      expect(
        wrapper
          .find(Grid)
          .at(7)
          .html()
      ).toEqual(expect.stringContaining('01/02/1980'))
    })

    describe('Access Restrictions label', () => {
      it('renders with Unrestricted', () => {
        expect(
          wrapper
            .find('#client-info-content')
            .dive()
            .find(Grid)
            .at(7)
            .html()
        ).toEqual(expect.stringContaining('Unrestricted'))
      })

      it('renders with Sealed', () => {
        const sealedParams = { ...params }
        sealedParams.client.sensitivity_type = 'SEALED'
        expect(
          clientWrapper(sealedParams)
            .find('#client-info-content')
            .dive()
            .find(Grid)
            .at(7)
            .html()
        ).toEqual(expect.stringContaining('Sealed'))
      })

      it('renders with Sensitive', () => {
        const sensitiveParams = { ...params }
        sensitiveParams.client.sensitivity_type = 'SENSITIVE'
        expect(
          clientWrapper(sensitiveParams)
            .find('#client-info-content')
            .dive()
            .find(Grid)
            .at(7)
            .html()
        ).toEqual(expect.stringContaining('Sensitive'))
      })
    })
  })
})
