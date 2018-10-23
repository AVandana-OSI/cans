import React from 'react'
import { SearchContainer } from './index'
import { childInfoJson } from '../Client/Client.helper.test'
import ClientService from '../Client/Client.service'
import { shallow, mount } from 'enzyme'
// import { PageInfo } from '../Layout';
import PersonSearchForm from './PersonSearchForm'
import SearchAssessmentHistory from './SearchAssessmentHistory'
import Typography from '@material-ui/core/Typography/Typography'
import { MemoryRouter, Link } from 'react-router-dom'
import { assessment, updatedAssessment, initialAssessment, instrument } from '../Assessment/assessment.mocks.test'
// import { LoadingState } from '../../util/loadingHelper';

jest.useFakeTimers()

const defaultProps = {}

const mountWithRouter = async component => mount(<MemoryRouter initialEntries={['/random']}>{component}</MemoryRouter>)

describe('<SearchContainer />', () => {
  describe('init SearchContainer', () => {
    describe('page layout', () => {
      const props = {}

      beforeEach(() => {
        //
      })

      const getLength = (wrapper, component) => wrapper.find(component).length

      // it('renders with 1 <PageInfo /> component', () => {
      //   const wrapper = shallow(<SearchContainer {...props} />);
      //   expect(getLength(wrapper, PageInfo)).toBe(1);
      // });
    })

    describe('page title', () => {
      it('should be "Search Clients Only" for new assessment', () => {
        const wrapper = shallow(<SearchContainer {...defaultProps} />)
        // const pageInfoText = wrapper
        //   .find('PageInfo')
        //   .render()
        //   .text();
        // expect(pageInfoText).toMatch(/New CANS/);
        // expect(pageInfoText).toMatch(/Print/);
      })
    })
  })

  describe('Search Component', () => {
    describe('Search Field', () => {
      // it('redirects to child/youth profile page on when a search result is selected', async () => {
      //   const assessmentServicePostSpy = jest.spyOn(AssessmentService, 'postAssessment');
      //   assessmentServicePostSpy.mockReturnValue(Promise.resolve({ id: 123 }));
      //   const wrapper = shallow(<SearchContainer {...defaultProps} />, {
      //     disableLifecycleMethods: true,
      //   });
      //   expect(wrapper.find('Redirect').length).toBe(0);
      //   await wrapper.instance().handleSubmitAssessment();
      //   expect(wrapper.state().redirection).toEqual({
      //     shouldRedirect: true,
      //     successAssessmentId: 123,
      //   });
      //   expect(wrapper.find('Redirect').exists()).toBe(true);
      //   await wrapper.update();
      //   wrapper.instance().componentDidUpdate();
      //   expect(wrapper.state().redirection).toEqual({
      //     shouldRedirect: false,
      //     successAssessmentId: 123,
      //   });
      //   expect(wrapper.find('Redirect').exists()).toBe(false);
      // });
    })

    describe('handleOnChange', () => {
      // let wrapper;
      // let instance;
      // beforeEach(() => {
      //   wrapper = shallow(<SearchContainer {...defaultProps} />);
      //   instance = wrapper.instance();
      // });
      // it('should default isValidDate to true', () => {
      //   expect(instance.state.isValidDate).toEqual(true);
      // });
      // it('should set isValidDate to true when date is valid', () => {
      //   instance.setState({ isValidDate: false });
      //   instance.handleKeyUp({ target: { value: '10/09/2018' } });
      //   expect(instance.state.isValidDate).toEqual(true);
      // });
      // it('should set isValidDate to false when date is invalid', () => {
      //   instance.handleKeyUp({ target: { value: '325982323' } });
      //   expect(instance.state.isValidDate).toEqual(false);
      //   instance.handleKeyUp({ target: { value: '10/2019/21' } });
      //   expect(instance.state.isValidDate).toEqual(false);
      //   instance.handleKeyUp({ target: { value: '' } });
      //   expect(instance.state.isValidDate).toEqual(false);
      //   instance.handleKeyUp({ target: {} });
      //   expect(instance.state.isValidDate).toEqual(false);
      // });
    })
  })
})
