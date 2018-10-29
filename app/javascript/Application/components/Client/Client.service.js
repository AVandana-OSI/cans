import { apiGet, apiPost, apiPut } from '../../App.api'
import { fakeJson } from './ClientSocialWorkerDummyJson'

export class ClientService {
  static fetch(id) {
    return apiGet(`/people/${id}`)
  }

  static search({ firstName, middleName, lastName, dob, pagination: { page, pageSize } }) {
    const payload = {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      dob,
      person_role: 'CLIENT',
      pagination: {
        page,
        page_size: pageSize,
      },
    }
    return apiPost('/people/_search', payload)
  }

  static socialWorkerClient(id) {
    const fakeapi = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id) resolve(fakeJson)
      }, 500)
    })

    return fakeapi
  }

  static socialWorkerClientDev(id) {
    return apiGet(`/staff/${id}/people`)
  }

  static addClient(childInfoObj) {
    return apiPost(`/people`, childInfoObj)
  }

  static updateClient(id, childInfoObj) {
    return apiPut(`/people/${id}`, childInfoObj)
  }
}

export default ClientService
