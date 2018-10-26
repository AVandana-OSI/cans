export const staff = [
  { staff_person: { first_name: 'Jory', last_name: 'Cassel' }, in_progress_count: 5, clients_count: 10 },
  { staff_person: { first_name: 'Rodrik', last_name: 'Cassel' }, in_progress_count: 10, clients_count: 12 },
  { staff_person: { first_name: 'Heward', last_name: 'Wyl' }, in_progress_count: 2, clients_count: 6 },
]

describe('Staff mock', () => {
  it('is defined', () => {
    expect(staff).toBeDefined()
  })
})
