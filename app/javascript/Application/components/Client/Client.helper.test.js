import { formatClientName, formatClientStatus } from './Client.helper'

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

  describe('formatClientStatus', () => {
    it('returns In progress', () => {
      const status = 'IN_PROGRESS'
      const expectedStatus = formatClientStatus(status)

      expect(expectedStatus).toEqual('In progress')
    })

    it('returns Completed', () => {
      const status = 'COMPLETED'
      const expectedStatus = formatClientStatus(status)

      expect(expectedStatus).toEqual('Completed')
    })

    it('returns No priorCANS', () => {
      const status = 'NO_PRIOR_CANS'
      const expectedStatus = formatClientStatus(status)

      expect(expectedStatus).toEqual('No prior CANS')
    })

    it('returns Unknown', () => {
      const status = ''
      const expectedStatus = formatClientStatus(status)

      expect(expectedStatus).toEqual('Unknown')
    })
  })
})

export const childInfoJson = {
  county: { id: 5, name: 'Calaveras', external_id: '1072', export_id: '05' },
  dob: '2014-01-28',
  first_name: 'Test',
  id: 10,
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

export const socialWorkerClientsJson = [
  {
    external_id: 137545,
    first_name: 'Yasmeen',
    middle_name: '',
    last_name: 'Bailey',
    suffix: '',
    dob: '2000-10-01',
    reminder_date: '2017-09-24',
    status: 'IN_PROGRESS',
  },
  {
    external_id: 117503,
    first_name: 'Selmer',
    middle_name: '',
    last_name: 'ashirian',
    suffix: '',
    dob: '2010-05-24',
    reminder_date: '2016-08-02',
    status: 'COMPLETED',
  },
  {
    external_id: 112501,
    first_name: 'Trenton',
    middle_name: '',
    last_name: 'Bayer',
    suffix: '',
    dob: '2003-01-01',
    reminder_date: '2017-05-14',
    status: 'NO_PRIOR_CANS',
  },
  {
    external_id: 117504,
    first_name: 'Jacey',
    middle_name: '',
    last_name: 'Bogan',
    suffix: '',
    dob: '2018-10-26',
    reminder_date: '2018-10-26',
    status: 'NO_PRIOR_CANS',
  },
  {
    external_id: 150000,
    first_name: 'Hailee',
    middle_name: '',
    last_name: 'Brown',
    suffix: '',
    dob: '2010-10-10',
    reminder_date: '2017-12-22',
    status: 'IN_PROGRESS',
  },
]

describe('All mock data are defined', () => {
  it('is defined', () => {
    expect(socialWorkerClientsJson).toBeDefined()
    expect(personsJson).toBeDefined()
    expect(childInfoJson).toBeDefined()
  })
})
