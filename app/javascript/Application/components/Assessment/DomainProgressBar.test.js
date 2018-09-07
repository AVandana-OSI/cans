import React from 'react';
import { shallow } from 'enzyme';
import DomainProgressBar from './DomainProgressBar';

const shallowProgressBar = (isAssessmentUnderSix, domain) =>
  shallow(<DomainProgressBar isAssessmentUnderSix={isAssessmentUnderSix} domain={domain} />);

describe('<DomainProgressBar />', () => {
  it('should render the progress bar', () => {
    const domain = {
      items: [
        {
          required: true,
          rating: -1,
        },
        {
          above_six_id: '2',
          required: true,
          rating: 1,
        },
        {
          above_six_id: '3',
          required: true,
          rating: 2,
        },
        {
          above_six_id: '4',
          required: true,
          rating: -1,
        },
      ],
    };
    const progressBar = shallowProgressBar(false, domain);
    expect(progressBar.find('.domain-progress-bar').length).toBe(1);
    expect(progressBar.find('.progress-value').text()).toBe('2/3');
    const progress = progressBar.find('.progress-line');
    expect(progress.length).toBe(1);
    expect(progress.get(0).props.style['width']).toBe('67%');
  });

  describe('#buildState()', () => {
    it('should ignore not required fields', () => {
      const progressBar = shallowProgressBar(true, {
        items: [
          {
            under_six_id: '1',
            required: false,
            rating: -1,
          },
          {
            under_six_id: '2',
            required: true,
            rating: 1,
          },
          {
            under_six_id: '3',
            required: true,
            rating: -1,
          },
        ],
      });
      expect(progressBar.state()).toEqual({
        total: 2,
        filled: 1,
        progress: 50,
      });
    });

    describe('when assessment is under six', () => {
      it('should ignore fields with no under_six_id', () => {
        const progressBar = shallowProgressBar(true, {
          items: [
            {
              required: true,
              rating: -1,
            },
            {
              under_six_id: '2',
              required: true,
              rating: 1,
            },
            {
              under_six_id: '3',
              required: true,
              rating: 2,
            },
            {
              under_six_id: '4',
              required: true,
              rating: -1,
            },
          ],
        });
        expect(progressBar.state()).toEqual({
          total: 3,
          filled: 2,
          progress: 67,
        });
      });

      it('should return 50 when one of two items has a rating', () => {
        const progressBar = shallowProgressBar(true, {
          items: [
            {
              under_six_id: '1',
              required: true,
              rating: -1,
            },
            {
              under_six_id: '2',
              required: true,
              rating: 1,
            },
          ],
        });
        expect(progressBar.state()).toEqual({
          total: 2,
          filled: 1,
          progress: 50,
        });
      });
    });

    describe('when assessment is not under six', () => {
      it('should ignore fields with no above_six_id', () => {
        const progressBar = shallowProgressBar(false, {
          items: [
            {
              required: true,
              rating: -1,
            },
            {
              above_six_id: '2',
              required: true,
              rating: 1,
            },
            {
              above_six_id: '3',
              required: true,
              rating: -1,
            },
          ],
        });
        expect(progressBar.state()).toEqual({
          total: 2,
          filled: 1,
          progress: 50,
        });
      });
    });
  });
});
