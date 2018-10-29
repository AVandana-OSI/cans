export function formatClientName({ first_name: firstName, middle_name: middleName, last_name: lastName, suffix }) {
  let result = `${lastName}, ${firstName}`
  if (middleName) {
    result += ` ${middleName}`
  }
  if (suffix) {
    result += `, ${suffix}`
  }
  return result
}

export function formatClientStatus(status) {
  switch (status) {
    case 'IN_PROGRESS':
      return 'In process'
    case 'COMPLETED':
      return 'Completed'
    case 'NO_PRIOR_CANS':
      return 'No priorCANS'
    default:
      return 'Unknown'
  }
}

export const failedFetching = { message: 'Fail to fetch data from server side!' }
