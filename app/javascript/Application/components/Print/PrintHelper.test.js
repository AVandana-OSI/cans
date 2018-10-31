import { print } from './PrintHelper'
import * as Common from '../../util/common'

jest.mock('../../util/common')

describe('PrintHelper', () => {
  describe('print', () => {
    it('is defined', () => {
      expect(print).toBeDefined()
    })

    describe('when isFirefox', () => {
      let frame

      beforeEach(() => {
        Common.isFirefox = true

        frame = {
          focus: jest.fn(),
          contentWindow: {
            print: jest.fn(),
          },
          contentDocument: {
            body: {},
            write: jest.fn(),
          },
        }

        jest.spyOn(document, 'getElementById').mockReturnValue(frame)
      })

      it('prints the contentWindow', () => {
        const contentWindow = frame.contentWindow
        const doc = frame.contentDocument

        print('my-id', 'My Content String')
        expect(document.getElementById).toHaveBeenCalledWith('my-id')
        expect(frame.focus).toHaveBeenCalledTimes(1)
        expect(doc.write).toHaveBeenCalledWith('My Content String')
        expect(contentWindow.print).toHaveBeenCalledTimes(1)
      })
    })

    describe('when not isFirefox', () => {
      let frame

      beforeEach(() => {
        Common.isFirefox = false

        frame = {
          contentWindow: {
            focus: jest.fn(),
            print: jest.fn(),
            document: {
              open: jest.fn(),
              write: jest.fn(),
              close: jest.fn(),
            },
          },
        }

        jest.spyOn(document, 'getElementById').mockReturnValue(frame)
      })

      it('prints the contentWindow', () => {
        const contentWindow = frame.contentWindow
        const doc = contentWindow.document
        print('my-id', 'My Content String')
        expect(document.getElementById).toHaveBeenCalledWith('my-id')
        expect(contentWindow.focus).toHaveBeenCalledTimes(1)
        expect(doc.open).toHaveBeenCalledTimes(1)
        expect(doc.write).toHaveBeenCalledWith('My Content String')
        expect(doc.close).toHaveBeenCalledTimes(1)
        expect(contentWindow.print).toHaveBeenCalledTimes(1)
      })
    })
  })
})
