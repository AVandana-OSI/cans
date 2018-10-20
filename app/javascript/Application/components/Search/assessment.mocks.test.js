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
};

export const assessment = {
  id: 1,
  instrument_id: 1,
  person: childInfoJson,
  county: childInfoJson.county,
  assessment_type: 'INITIAL',
  status: 'IN_PROGRESS',
  completed_as: 'COMMUNIMETRIC',
  can_release_confidential_info: false,
  has_caregiver: false,
  state: {
    under_six: false,
    caregiver_domain_template: {
      id: '6',
      code: 'CGV',
      is_caregiver_domain: true,
      items: [
        {
          code: '1',
        },
      ],
    },
    domains: [
      {
        id: 0,
        code: '123',
        items: [
          {
            above_six_id: '1',
            code: '1',
            confidential: false,
            confidential_by_default: false,
            rating: 1,
            rating_type: 'REGULAR',
            required: true,
            under_six_id: 'EC01',
          },
          {
            above_six_id: '2',
            code: 'SUBSTANCE_USE',
            confidential: false,
            confidential_by_default: false,
            rating: 1,
            rating_type: 'REGULAR',
            required: true,
            under_six_id: 'EC01',
          },
          {
            above_six_id: '2',
            code: 'SUBSTANCE_USE_CAREGIVER',
            confidential: false,
            confidential_by_default: false,
            rating: 1,
            rating_type: 'REGULAR',
            required: true,
            under_six_id: 'EC01',
          },
          {
            above_six_id: '2',
            code: 'EXPOSURE',
            confidential: false,
            confidential_by_default: true,
            rating: 1,
            rating_type: 'REGULAR',
            required: true,
            under_six_id: 'EC01',
          },
        ],
        underSix: true,
        aboveSix: true,
      },
    ],
  },
  event_date: '2018-06-11',
};
