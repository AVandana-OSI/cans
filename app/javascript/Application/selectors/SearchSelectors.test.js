import { RESIDENCE_TYPE } from '../enums/AddressType'
import NAME_SUFFIXES from '../enums/NameSuffixes'
import { selectPeopleResults } from './SearchSelectors'

describe('peopleSearchSelectors', () => {
  const languages = [{ code: '1', value: 'English' }, { code: '2', value: 'French' }, { code: '3', value: 'Italian' }]
  const ethnicityTypes = [
    { code: '1', value: 'European' },
    { code: '2', value: 'French' },
    { code: '3', value: 'Romanian' },
  ]
  const raceTypes = [{ code: '1', value: 'Race 1' }, { code: '2', value: 'Race 2' }, { code: '3', value: 'Race 3' }]
  const unableToDetermineCodes = [
    { code: 'A', value: 'Abandoned' },
    { code: 'I', value: 'Unknown' },
    { code: 'K', value: 'Unknown' },
  ]
  const hispanicOriginCodes = [{ code: 'Y', value: 'yes' }, { code: 'N', value: 'no' }]
  const addressTypes = [{ code: RESIDENCE_TYPE, value: 'address type' }]

  const counties = [{ code: '999', value: 'SysCode Nowhere' }, { code: '998', value: 'SysCode Places' }]

  const systemCodes = {
    addressTypes,
    counties,
    ethnicityTypes,
    hispanicOriginCodes,
    languages,
    raceTypes,
    unableToDetermineCodes,
  }

  const mockClientResult = {
    sort: [125.48025, 'person-summary#9GE4pyI0N3'],
    _source: {
      id: '1',
      first_name: 'Bart',
      last_name: 'Simpson',
      middle_name: 'Jacqueline',
      name_suffix: 'md',
      gender: 'female',
      languages: [{ id: '3', name: 'Italian' }, { id: '2', name: 'French' }],
      race_ethnicity: {
        hispanic_origin_code: 'Y',
        hispanic_unable_to_determine_code: 'Y',
        unable_to_determine_code: '',
        race_codes: [{ id: '1', description: 'Race 1' }],
        hispanic_codes: [{ description: 'Central American' }],
      },
      date_of_birth: '1990-02-13',
      date_of_death: '2000-02-18',
      ssn: '123456789',
      client_counties: [
        {
          description: 'SysCode Nowhere',
          id: '999',
        },
        {
          description: 'SysCode Places',
          id: '998',
        },
      ],
      addresses: [
        {
          id: '1',
          street_number: '234',
          street_name: 'Fake Street',
          city: 'Flushing',
          state_code: 'state',
          zip: '11344',
          type: { id: RESIDENCE_TYPE },
          phone_numbers: [
            {
              number: '2126666666',
              type: 'Home',
            },
          ],
        },
      ],
      phone_numbers: [
        {
          id: '2',
          number: '9949076774',
          type: 'Home',
        },
      ],
      legacy_descriptor: {
        legacy_ui_id: '123-456-789',
        legacy_table_description: 'Client',
      },
      sensitivity_indicator: 'S',
      open_case_responsible_agency_code: 'P',
    },
  }

  describe('selectPeopleResults', () => {
    it('maps person search attributes to suggestion attributes', () => {
      const peopleSearch = {
        results: [mockClientResult],
      }
      const response = {
        ...peopleSearch,
        systemCodes,
      }
      const peopleResults = selectPeopleResults(response)
      expect(peopleResults).toEqual([
        {
          legacy_id: '1',
          fullName: 'Simpson, MD, Bart Jacqueline',
          gender: 'female',
          legacyDescriptor: {
            legacy_ui_id: '123-456-789',
            legacy_table_description: 'Client',
          },
          languages: ['Italian', 'French'],
          races: ['Race 1'],
          dateOfBirth: '1990-02-13',
          isCsec: false,
          isDeceased: true,
          isProbationYouth: true,
          ssn: '123-45-6789',
          clientCounties: ['SysCode Nowhere', 'SysCode Places'],
          address: {
            city: 'Flushing',
            state: 'state',
            zip: '11344',
            type: 'address type',
            streetAddress: '234 Fake Street',
          },
          phoneNumber: {
            number: '(212) 666-6666',
            type: 'Home',
          },
          isSensitive: true,
          isSealed: false,
          sort: [125.48025, 'person-summary#9GE4pyI0N3'],
        },
      ])
    })

    it('maps the first address and its phone number result to address and phone number', () => {
      const peopleSearch = {
        results: [mockClientResult],
      }
      const response = {
        ...peopleSearch,
        systemCodes,
      }
      const peopleResults = selectPeopleResults(response)

      expect(peopleResults[0].address).toEqual({
        city: 'Flushing',
        state: 'state',
        zip: '11344',
        type: 'address type',
        streetAddress: '234 Fake Street',
      })
      expect(peopleResults[0].phoneNumber).toEqual({
        number: '(212) 666-6666',
        type: 'Home',
      })
    })

    it('maps person search attributes when phone numbers and addresses are empty', () => {
      const peopleSearch = {
        results: [
          {
            _source: {
              phone_numbers: [],
              addresses: [],
            },
          },
        ],
      }
      const response = {
        ...peopleSearch,
        systemCodes,
      }
      const peopleResults = selectPeopleResults(response)

      expect(peopleResults[0].address).toEqual(null)
      expect(peopleResults[0].phoneNumber).toEqual(null)
    })

    it('does not flag csec status when the person has no csec items', () => {
      const clientWithNoCsecInfo = JSON.parse(JSON.stringify(mockClientResult))
      clientWithNoCsecInfo._source.csec = []
      const peopleSearch = {
        results: [clientWithNoCsecInfo],
      }
      const response = { ...peopleSearch, systemCodes }
      const peopleResults = selectPeopleResults(response)

      expect(peopleResults[0].isCsec).toEqual(false)
    })

    it('does not flag csec status when the person has only ended csec items', () => {
      const clientWithCsecInfo = JSON.parse(JSON.stringify(mockClientResult))
      clientWithCsecInfo._source.csec = [
        { start_date: '2018-01-01', end_date: '2018-02-02' },
        { start_date: '2018-01-01', end_date: '2018-02-02' },
      ]
      const peopleSearch = { results: [clientWithCsecInfo] }
      const response = { ...peopleSearch, systemCodes }
      const peopleResults = selectPeopleResults(response)

      expect(peopleResults[0].isCsec).toEqual(false)
    })

    describe('when highlighting', () => {
      function personWithHighlights(highlight) {
        return {
          results: [
            {
              _source: {
                id: '1',
                first_name: 'Bart',
                last_name: 'Simpson',
                middle_name: '',
                name_suffix: '',
                gender: 'female',
                languages: [{ id: '3', name: 'Italian' }, { id: '2', name: 'French' }],
                race_ethnicity: {
                  hispanic_origin_code: 'Y',
                  hispanic_unable_to_determine_code: 'Y',
                  unable_to_determine_code: '',
                  race_codes: [{ id: '1', description: 'Race 1' }],
                  hispanic_codes: [{ description: 'Central American' }],
                },
                date_of_birth: '1990-02-13',
                date_of_death: '2000-02-18',
                ssn: '123456789',
                client_counties: [
                  {
                    description: 'SysCode Nowhere',
                    id: '999',
                  },
                  {
                    description: 'SysCode Places',
                    id: '998',
                  },
                ],
                addresses: [
                  {
                    id: '1',
                    street_number: '234',
                    street_name: 'Fake Street',
                    city: 'Flushing',
                    state_code: 'state',
                    zip: '11344',
                    type: { id: RESIDENCE_TYPE },
                    phone_numbers: [
                      {
                        number: '2125550123',
                        type: 'Home',
                      },
                    ],
                  },
                  {
                    id: '2',
                    street_number: '2',
                    street_name: 'Camden Crt',
                    city: 'Flushing',
                    state_code: 'state',
                    zip: '11222',
                    type: { id: RESIDENCE_TYPE },
                    phone_numbers: [
                      {
                        number: '1231231234',
                        type: 'Home',
                      },
                    ],
                  },
                ],
                phone_numbers: [
                  {
                    number: '9949076774',
                    type: 'Home',
                  },
                  {
                    number: '1112226774',
                    type: 'Work',
                  },
                ],
                legacy_descriptor: {
                  legacy_ui_id: '123-456-789',
                  legacy_table_description: 'Client',
                },
                sensitivity_indicator: 'S',
                open_case_responsible_agency_code: 'P',
              },
              highlight,
            },
          ],
        }
      }
      it('should use exact highlighted fields if available', () => {
        const peopleSearch = personWithHighlights({
          first_name: ['<em>Bar</em>t'],
          last_name: ['Sim<em>pson</em>'],
          ssn: ['<em>123456789</em>'],
          searchable_date_of_birth: ['<em>1990</em>'],
          autocomplete_search_bar: ['<em>Bar</em>t', 'Sim<em>pson</em>', '<em>123456789</em>', '<em>1990</em>'],
        })
        const response = {
          ...peopleSearch,
          systemCodes,
        }
        const peopleResults = selectPeopleResults(response)
        expect(peopleResults[0].fullName).toEqual('Sim<em>pson</em>, <em>Bar</em>t')
        expect(peopleResults[0].ssn).toEqual('<em>123-45-6789</em>')
        expect(peopleResults[0].dateOfBirth).toEqual('<em>1990-02-13</em>')
      })

      it('should use exact highlighted and suffixes should return empty for invalid suffixes', () => {
        const peopleSearch = personWithHighlights({
          first_name: ['<em>Bar</em>t'],
          last_name: ['Sim<em>pson</em>'],
          name_suffix: ['<em>cccv</em>'],
          ssn: ['<em>123456789</em>'],
          searchable_date_of_birth: ['<em>1990</em>'],
          autocomplete_search_bar: [
            '<em>Bar</em>t',
            'Sim<em>pson</em>',
            '<em>123456789</em>',
            '<em>1990</em>',
            '<em>cccv</em>',
          ],
        })
        const response = {
          ...peopleSearch,
          systemCodes,
        }
        const peopleResults = selectPeopleResults(response)

        expect(peopleResults[0].fullName).toEqual('Sim<em>pson</em>, <em>Bar</em>t')
        expect(peopleResults[0].ssn).toEqual('<em>123-45-6789</em>')
        expect(peopleResults[0].dateOfBirth).toEqual('<em>1990-02-13</em>')
      })

      it('should check autocomplete_search_bar if no exact first_name', () => {
        const peopleSearch = personWithHighlights({
          // first_name: (no exact first name)
          last_name: ['Sim<em>pson</em>'],
          ssn: ['<em>123456789</em>'],
          searchable_date_of_birth: ['<em>1990</em>'],
          autocomplete_search_bar: ['<em>Bar</em>t', 'Sim<em>pson</em>', '<em>123456789</em>', '<em>1990</em>'],
        })
        const response = {
          ...peopleSearch,
          systemCodes,
        }
        const peopleResults = selectPeopleResults(response)
        expect(peopleResults[0].fullName).toEqual('Sim<em>pson</em>, <em>Bar</em>t')
      })

      it('should check autocomplete_search_bar if no exact last_name', () => {
        const peopleSearch = personWithHighlights({
          first_name: ['<em>Bar</em>t'],
          // last_name: (no exact last name)
          ssn: ['<em>123456789</em>'],
          searchable_date_of_birth: ['<em>1990</em>'],
          autocomplete_search_bar: ['<em>Bar</em>t', 'Sim<em>pson</em>', '<em>123456789</em>', '<em>1990</em>'],
        })
        const response = {
          ...peopleSearch,
          systemCodes,
        }
        const peopleResults = selectPeopleResults(response)
        expect(peopleResults[0].fullName).toEqual('Sim<em>pson</em>, <em>Bar</em>t')
      })

      it('should find autocomplete fields in any order', () => {
        const peopleSearch = personWithHighlights({
          autocomplete_search_bar: ['<em>123456789</em>', '<em>Simpson</em>', '<em>1990</em>', '<em>Annie</em>'],
        })
        const response = {
          ...peopleSearch,
          systemCodes,
        }
        const peopleResults = selectPeopleResults(response)
        expect(peopleResults[0].fullName).toEqual('<em>Simpson</em>, Bart')
      })

      it('should use exact names if no highlight', () => {
        const peopleSearch = personWithHighlights({
          // first_name: (no first name matches)
          // last_name: (no last name matches)
          ssn: ['<em>123456789</em>'],
          searchable_date_of_birth: ['<em>1990</em>'],
          autocomplete_search_bar: [
            '<em>123456789</em>',
            '<em>1990</em>',
            // (no first name or last name matches)
          ],
        })
        const response = {
          ...peopleSearch,
          systemCodes,
        }
        const peopleResults = selectPeopleResults(response)
        expect(peopleResults[0].fullName).toEqual('Simpson, Bart')
      })
    })

    it('formats ssn', () => {
      const peopleSearch = {
        results: [mockClientResult],
      }
      const response = {
        ...peopleSearch,
        systemCodes,
      }
      const peopleResults = selectPeopleResults(response)
      expect(peopleResults[0].ssn).toEqual('123-45-6789')
    })

    it('formats highlighted ssn', () => {
      const peopleSearch = {
        results: [
          {
            highlight: {
              ssn: ['<em>123456789</em>'],
            },
            ...mockClientResult,
          },
        ],
      }
      const response = {
        ...peopleSearch,
        systemCodes,
      }
      const peopleResults = selectPeopleResults(response)
      expect(peopleResults[0].ssn).toEqual('<em>123-45-6789</em>')
    })
  })
})
