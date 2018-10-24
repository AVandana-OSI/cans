import Enzyme, { shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
// React 16 Enzyme adapter
Enzyme.configure({
  adapter: new Adapter(),
})
// Make Enzyme functions available in all test files without importing
global.shallow = shallow
global.render = render
global.mount = mount

const throwError = type => message => {
  throw new Error(`${type}: ${message}`)
}
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
console.error = throwError('Error')
console.warn = throwError('Warning')
