import { globalAlertService } from './GlobalAlertService'
import { handleError, forbiddenMessage } from './ApiErrorHandler'

describe('ApiErrorHandler', () => {
  describe('with a single error with incident id', () => {
    const error = {
      response: {
        data: {
          issue_details: [
            {
              incident_id: 'a1',
              user_message: 'User Message',
            },
          ],
        },
      },
    }

    it('sets a error message with attached incident id', () => {
      let message
      let isErrorThrowed = false
      globalAlertService.subscribe(e => {
        message = e.message
      })
      try {
        handleError(error)
      } catch (e) {
        isErrorThrowed = true
      }

      expect(message).toEqual('User Message [Incident id:a1]')
      expect(isErrorThrowed).toEqual(true)
    })
  })

  it('Handles multiple issue details', () => {
    const error = {
      response: {
        data: {
          issue_details: [
            {
              incident_id: 'a1',
              user_message: 'User Message',
            },
            {
              incident_id: 'a1',
              user_message: 'User Message 2',
            },
          ],
        },
      },
    }

    let messages = []
    let isErrorThrowed = false
    globalAlertService.subscribe(e => messages.push(e.message))
    try {
      handleError(error)
    } catch (e) {
      isErrorThrowed = true
    }
    expect(messages.length).toEqual(2)
    expect(isErrorThrowed).toEqual(true)
  })

  it('Handles undefined issue details (not api error response)', () => {
    const error = {
      message: 'Error message',
      response: {},
    }

    let messages = []
    let isErrorThrowed = false
    globalAlertService.subscribe(e => messages.push(e.message))
    try {
      handleError(error)
    } catch (e) {
      isErrorThrowed = true
    }
    expect(messages.length).toEqual(1)
    expect(messages[0]).toEqual('Error message')
    expect(isErrorThrowed).toEqual(true)
  })

  it('Handles empty error', () => {
    const error = {}

    let messages = []
    let isErrorThrowed = false
    globalAlertService.subscribe(e => messages.push(e.message))
    try {
      handleError(error)
    } catch (e) {
      isErrorThrowed = true
    }
    expect(messages.length).toEqual(1)
    expect(isErrorThrowed).toEqual(true)
  })

  it('Handles 401 error', () => {
    const error = {
      message: 'Error message',
      response: { status: 401 },
    }

    let messages = []
    globalAlertService.subscribe(e => messages.push(e.message))
    global.location = jest.fn()
    global.location.reload = jest.fn()
    try {
      handleError(error)
    } catch (e) {
      //  ignore
    }
    expect(global.location.reload).toBeCalled()
  })

  describe('when error status 409', () => {
    const error = {
      message: 'message',
      response: {
        status: 409,
      },
    }

    it('should not post global alert', () => {
      let messages = []
      globalAlertService.subscribe(e => messages.push(e.message))
      try {
        handleError(error)
      } catch (e) {
        // ignore
      }
      expect(messages.length).toEqual(0)
    })

    it('should throw error farther', () => {
      let isErrorThrowed = false
      try {
        handleError(error)
      } catch (e) {
        isErrorThrowed = true
      }
      expect(isErrorThrowed).toEqual(true)
    })
  })

  it('handles 403 error', () => {
    const error = {
      response: {
        status: 403,
      },
    }
    let message
    let isErrorThrowed = false
    globalAlertService.subscribe(e => (message = e.message))
    try {
      handleError(error)
    } catch (e) {
      isErrorThrowed = true
    }
    expect(message).toEqual(forbiddenMessage)
    expect(isErrorThrowed).toEqual(true)
  })
})
