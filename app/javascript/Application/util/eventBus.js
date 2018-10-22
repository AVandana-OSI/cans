function EventBus() {
  const eventCallbacksPairs = []
  this.subscribe = (eventType, callback) => {
    const eventCallbacksPair = findEventCallbacksPair(eventType)

    if (eventCallbacksPair) {
      eventCallbacksPair.callbacks.push(callback)
    } else {
      eventCallbacksPairs.push(new EventCallbacksPair(eventType, callback))
    }
  }
  this.post = (eventType, args) => {
    const eventCallbacksPair = findEventCallbacksPair(eventType)

    if (!eventCallbacksPair) {
      return
    }

    eventCallbacksPair.callbacks.forEach(callback => callback(args))
  }
  const findEventCallbacksPair = eventType => {
    return eventCallbacksPairs.find(eventObject => eventObject.eventType === eventType)
  }
}

function EventCallbacksPair(eventType, callback) {
  this.eventType = eventType
  this.callbacks = [callback]
}

export const eventBus = new EventBus()
