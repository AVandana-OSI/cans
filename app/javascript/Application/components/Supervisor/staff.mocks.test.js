export const staff = [
  {
    staff_person: { first_name: 'Jory', last_name: 'Cassel' },
    clients_count: 10,
    no_prior_cans_count: 4,
    in_progress_count: 5,
    completed_count: 1,
  },
  {
    staff_person: { first_name: 'Rodrik', last_name: 'Cassel' },
    clients_count: 12,
    no_prior_cans_count: 8,
    in_progress_count: 2,
    completed_count: 2,
  },
  {
    staff_person: { first_name: 'Heward', last_name: 'Wyl' },
    clients_count: 0,
    no_prior_cans_count: 0,
    in_progress_count: 0,
    completed_count: 0,
  },
]

describe('Staff mock', () => {
  it('is defined', () => {
    expect(staff).toBeDefined()
  })
})
