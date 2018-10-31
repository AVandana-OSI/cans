import { formatClientName } from './Client.helper'

describe('Client.helper', () => {
  describe('formatClientName', () => {
    describe('client with firstName, midleName ', () => {
      it('returns lastName, firstName', () => {
        const client = { first_name: 'first', last_name: 'last' }
        const expectedName = formatClientName(client)

        expect(expectedName).toEqual('last, first')
      })

      it('returns lastName, firstName middle', () => {
        const client = { first_name: 'first', last_name: 'last', middle_name: 'middle' }
        const expectedName = formatClientName(client)

        expect(expectedName).toEqual('last, first middle')
      })

      it('returns lastName, firstName, suffix', () => {
        const client = { first_name: 'first', last_name: 'last', suffix: 'suffix' }
        const expectedName = formatClientName(client)

        expect(expectedName).toEqual('last, first, suffix')
      })

      it('returns lastName, firstName middle, suffix', () => {
        const client = { first_name: 'first', last_name: 'last', middle_name: 'middle', suffix: 'suffix' }
        const expectedName = formatClientName(client)

        expect(expectedName).toEqual('last, first middle, suffix')
      })
    })
  })
})

export const childInfoJson = {
  county: { id: 5, name: 'Calaveras', external_id: '1072', export_id: '05' },
  dob: '2014-01-28',
  first_name: 'Test',
  id: 10,
  identifier: 'aaaaaaaaaa',
  last_name: 'Child',
  person_role: 'CLIENT',
  cases: [],
  metadata: {
    editable: true,
  },
}

export const personsJson = [
  {
    id: 1,
    first_name: 'Bruce',
    middle_name: 'Middle',
    last_name: 'wayne',
    suffix: 'Mr.',
    dob: '2014-01-28',
    sensitivity_type: 'SENSITIVE',
    metadata: {
      editable: false,
    },
  },
  {
    id: 4,
    first_name: 'Peter',
    middle_name: 'Middle',
    last_name: 'Parker',
    suffix: 'Mr.',
    dob: '2015-01-28',
    sensitivity_type: 'SENSITIVE',
    metadata: {},
  },
  {
    id: 3,
    first_name: 'Charley',
    middle_name: 'Middle',
    last_name: 'Parker',
    suffix: 'Mr.',
    dob: '2016-01-28',
    metadata: {
      editable: true,
    },
  },
]
