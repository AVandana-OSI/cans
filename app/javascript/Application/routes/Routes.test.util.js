import React from 'react'
import PropTypes from 'prop-types'
import { render, unmountComponentAtNode } from 'react-dom'
import { Route, MemoryRouter } from 'react-router-dom'

// This code can be found at:
// https://reacttraining.com/react-router/web/guides/testing

// This is a way to render any part of your app inside a MemoryRouter
// you pass it a list of steps to execute when the location
// changes, it will call back to you with stuff like
// `match` and `location`, and `history` so you can control
// the flow and make assertions.
/* eslint-disable */
export const renderTestSequence = ({ initialIndex, subject: Subject, steps }) => {
  const div = document.createElement('div');

  class Assert extends React.Component {
    componentDidMount() {
      this.assert();
    }

    componentDidUpdate() {
      this.assert();
    }

    assert() {
      const nextStep = steps.shift();
      if (nextStep) {
        nextStep({ ...this.props, div });
      } else {
        unmountComponentAtNode(div);
      }
    }

    render() {
      return this.props.children;
    }

    static propTypes = {
      children: PropTypes.node,
    };
  }

  class Test extends React.Component {
    render() {
      return (
        <MemoryRouter initialIndex={initialIndex} initialEntries={['/']}>
          <Route
            render={props => (
              <Assert {...props}>
                <Subject />
              </Assert>
            )}
          />
        </MemoryRouter>
      );
    }
  }

  render(<Test />, div);
  unmountComponentAtNode(div);
};

/**
 * Creates a component to house the routed component to be
 * tested.
 *
 * Builds the test assertions that are passed to renderTestSequence()
 *
 * @param component The component that you are routing to
 * @param url The url defined in the route definition
 * @param htmlOnPage A string that the component will render
 */
export const executeTest = (component, url, htmlOnPage) => {
  // This code was slightly modified from the original to fit
  // the needs of the project

  // our Subject, the App
  const App = () => (
    <div>
      <Route
        exact
        path="/"
        render={() => (
          <div>
            <h1>Welcome</h1>
          </div>
        )}
      />
      <Route path={url} children={() => component} />
    </div>
  );

  return renderTestSequence({
    // tell it the subject you're testing
    subject: App,

    // and the steps to execute each time the location changes
    steps: [
      // initial render
      ({ history, location, div }) => {
        // assert the screen says what we think it should
        expect(location.pathname).toBe('/');
        expect(div.innerHTML).toMatch(/Welcome/);

        // now we can imperatively navigate as the test
        history.push(url);
      },

      // second render from new location
      ({ location, div }) => {
        expect(location.pathname).toBe(url);
        expect(div.innerHTML).toMatch(new RegExp(`${htmlOnPage}`));
      },
    ],
  });
};
