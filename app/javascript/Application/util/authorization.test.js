import { canUserAddClient } from './authorization'

describe('Authorization Helpers', () => {
  const sacramentan = {
    county: 'Sacramento',
  }

  const clients = {
    sensitive_sacramentan: {
      isSensitive: true,
      clientCounties: ['Sacramento'],
    },
    sensitive_siskiyouan: {
      isSensitive: true,
      clientCounties: ['Siskiyou'],
    },
    sensitive_somewhere: {
      isSensitive: true,
      clientCounties: [],
    },
    nonsensitive: {
      isSensitive: false,
      clientCounties: ['Sacramento'],
    },
    multiple: {
      isSensitive: true,
      clientCounties: ['Sacramento', 'Siskiyou'],
    },
  }
  describe('canUserAddClient', () => {
    it('should deny nonsensitive users from adding sensitive clients', () => {
      expect(canUserAddClient(sacramentan, false, clients.sensitive_sacramentan)).toBe(false)
      expect(canUserAddClient(sacramentan, false, clients.sensitive_somewhere)).toBe(false)
    })

    it('should allow users to add nonsensitive clients', () => {
      expect(canUserAddClient(sacramentan, false, clients.nonsensitive)).toBe(true)
    })

    it('should allow sensitive users to add sensitive clients from their county', () => {
      expect(canUserAddClient(sacramentan, true, clients.sensitive_sacramentan)).toBe(true)
    })

    it('should deny sensitive users trying to add sensitive clients from other counties', () => {
      expect(canUserAddClient(sacramentan, true, clients.sensitive_siskiyouan)).toBe(false)
    })

    it('should defer to the API if sensitive client has no county', () => {
      expect(canUserAddClient(sacramentan, true, clients.sensitive_somewhere)).toBe(true)
    })

    it('should defer to the API if userInfo is missing', () => {
      expect(canUserAddClient(null, null, clients.sensitive_sacramentan)).toBe(true)
    })

    it('should defer to the API if the user has an override authority', () => {
      expect(canUserAddClient(sacramentan, true, clients.sensitive_siskiyouan, true)).toBe(true)
    })

    it('should defer to the API if the client is in multiple counties', () => {
      expect(canUserAddClient(sacramentan, false, clients.multiple, false)).toBe(true)
    })
  })
})
