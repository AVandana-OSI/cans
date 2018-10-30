import SocialWorkerCardTemplate from './ClientSocialWorkerCardTemplate'
describe(' ClientSocialWorkerCardTempate ', () => {
  const client = {
    id: 0,
    first_name: 'Jim',
    middle_name: 'Alen',
    last_name: 'Green',
    suffix: 'Mr.',
    dob: '2000-01-01',
    reminder_date: '2018-10-26',
    status: 'NO_PRIOR_CANS',
  }

  const template = SocialWorkerCardTemplate

  it('will return an array with length 4 because this a 4 columns template', () => {
    const expectedReturn = template()
    expect(expectedReturn.length).toEqual(4)
  })

  it('will return right Header', () => {
    const expectedFullNameHeader = template()[0].Header
    const expectedDoBHeader = template()[1].Header
    const expectedStatusHeader = template()[2].Header
    const expectedReminderDateHeader = template()[3].Header
    expect(expectedFullNameHeader).toEqual('Client Name')
    expect(expectedDoBHeader).toEqual('DOB')
    expect(expectedStatusHeader).toEqual('CANS Status')
    expect(expectedReminderDateHeader).toEqual('Reminder Date')
  })

  it('all accessor works', () => {
    const accessorFullName = template()[0].accessor(client)
    const accessorDoB = template()[1].accessor(client)
    const accessorStatus = template()[2].accessor(client)
    const accessorReminderDate = template()[3].accessor(client)
    expect(accessorFullName).toEqual('Green, Jim Alen, Mr.')
    expect(accessorDoB).toEqual('01/01/2000')
    expect(accessorStatus).toEqual('No prior CANS')
    expect(accessorReminderDate).toEqual('10/26/2018')
  })
})
