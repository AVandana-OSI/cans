import { eventBus } from './eventBus'

describe('Event Bus', () => {
  it('creates subscription and and post event', () => {
    const eventType = 'EventType'
    const otherEventType = 'otherEventType'
    const event1 = 'event1'
    const event2 = 'event2'
    let callBack1Called = false
    let callBack2Called = false
    let callBack3Called = false
    const callBack1 = event => {
      callBack1Called = true
    }
    const callBack2 = event => {
      callBack2Called = true
    }
    const callBack3 = event => {
      callBack3Called = true
    }
    // subscribe
    eventBus.subscribe(eventType, callBack1)
    eventBus.subscribe(eventType, callBack2)
    eventBus.subscribe(otherEventType, callBack3)
    // post eventType
    eventBus.post(eventType, event1)
    expect(callBack1Called).toEqual(true)
    expect(callBack2Called).toEqual(true)
    expect(callBack3Called).toEqual(false)
    // post otherEventType
    eventBus.post(otherEventType, event2)
    expect(callBack3Called).toEqual(true)
  })
})
