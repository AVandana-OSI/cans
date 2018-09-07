import {
  validateAssessmentForSubmit,
  resetConfidentialByDefaultItems,
  shouldDomainBeRendered,
  shouldItemBeRendered,
} from './AssessmentHelper';
import { clone } from '../../util/common';

const validAssessment = {
  instrument_id: 1,
  person: {
    id: 1,
  },
  event_date: '2018-06-29',
  completed_as: 'COMMUNIMETRIC',
  can_release_confidential_info: false,
  assessment_type: 'INITIAL',
  status: 'SUBMITTED',
  has_caregiver: true,
  state: {
    under_six: false,
    domains: [
      {
        items: [
          {
            under_six_id: 'EC.1',
            above_six_id: '',
            code: 'PSYCHOSIS',
            required: true,
            confidential: false,
            confidential_by_default: true,
            rating_type: 'REGULAR',
            has_na_option: false,
            rating: 2,
          },
          {
            under_six_id: 'EC.2',
            above_six_id: '11',
            code: 'IMPULSIVITY_HYPERACTIVITY',
            required: true,
            confidential: false,
            confidential_by_default: false,
            rating_type: 'REGULAR',
            has_na_option: false,
            rating: 1,
          },
        ],
        id: 1,
        code: 'BEN',
        under_six: true,
        above_six: true,
      },
      {
        items: [
          {
            under_six_id: '',
            above_six_id: '10',
            code: 'FAMILY_FUNCTIONING',
            required: true,
            confidential: false,
            confidential_by_default: false,
            rating_type: 'REGULAR',
            has_na_option: false,
            rating: 1,
          },
          {
            under_six_id: '',
            above_six_id: '11',
            code: 'LIVING_SITUATION',
            required: true,
            confidential: false,
            confidential_by_default: false,
            rating_type: 'REGULAR',
            has_na_option: false,
            rating: 0,
          },
        ],
        id: 2,
        code: 'LFD',
        under_six: false,
        above_six: true,
      },
    ],
  },
};

describe('AssessmentHelper', () => {
  describe('#validateAssessmentForSubmit()', () => {
    describe('invalid state', () => {
      it('returns false when no event_date', () => {
        const assessment = clone(validAssessment);
        assessment.event_date = null;
        expect(validateAssessmentForSubmit(assessment)).toBe(false);
        assessment.event_date = '';
        expect(validateAssessmentForSubmit(assessment)).toBe(false);
      });

      it('returns false when no assessment_type', () => {
        const assessment = clone(validAssessment);
        assessment.assessment_type = null;
        expect(validateAssessmentForSubmit(assessment)).toBe(false);
        assessment.assessment_type = '';
        expect(validateAssessmentForSubmit(assessment)).toBe(false);
      });

      it('returns false when no completed_as', () => {
        const assessment = clone(validAssessment);
        assessment.completed_as = null;
        expect(validateAssessmentForSubmit(assessment)).toBe(false);
        assessment.completed_as = '';
        expect(validateAssessmentForSubmit(assessment)).toBe(false);
      });

      it('returns false when rating is not set for 1 above six item', () => {
        const assessment = clone(validAssessment);
        assessment.state.under_six = true;
        assessment.state.domains[0].items[0].rating = -1;
        expect(validateAssessmentForSubmit(assessment)).toBe(false);
      });

      it('returns false when rating is not set for 1 under six item', () => {
        const assessment = clone(validAssessment);
        assessment.state.domains[1].items[0].rating = -1;
        expect(validateAssessmentForSubmit(assessment)).toBe(false);
      });

      it('returns false when domain is above_six rating is not set for 1 under six item', () => {
        const assessment = clone(validAssessment);
        assessment.state.domains[1].items[0].rating = -1;
        expect(validateAssessmentForSubmit(assessment)).toBe(false);
      });
    });

    describe('valid state', () => {
      it('returns true when valid assessment state', () => {
        const actual = validateAssessmentForSubmit(validAssessment);
        expect(actual).toBe(true);
      });

      it('returns true when domain is above_six but item is under_six and has no rating', () => {
        const assessment = clone(validAssessment);
        assessment.state.domains[0].items[0].rating = -1;
        expect(validateAssessmentForSubmit(assessment)).toBe(true);
      });
    });
  });

  describe('#resetConfidentialByDefaultItems()', () => {
    it('should initialize all confidential by default items with confidential=true', () => {
      // given
      const assessment = clone(validAssessment);
      expect(assessment.state.domains[0].items[0].confidential).toBe(false);

      // when
      resetConfidentialByDefaultItems(assessment);

      // then
      expect(assessment.state.domains[0].items[0].confidential).toBe(true);
    });
  });

  describe('#shouldDomainBeRendered()', () => {
    describe('when domain is under six', () => {
      const domain = { under_six: true };
      it('should return true when the assessment is under six', () => {
        expect(shouldDomainBeRendered(true, domain)).toBeTruthy();
      });

      it('should return false when the assessment is not under six', () => {
        expect(shouldDomainBeRendered(false, domain)).toBeFalsy();
      });
    });

    describe('when domain is above six', () => {
      const domain = { above_six: true };
      it('should return false when the assessment is under six', () => {
        expect(shouldDomainBeRendered(true, domain)).toBeFalsy();
      });

      it('should return true when the assessment is not under six', () => {
        expect(shouldDomainBeRendered(false, domain)).toBeTruthy();
      });
    });
  });

  describe('#shouldItemBeRendered()', () => {
    describe('when the item has an under six id', () => {
      const item = { under_six_id: '1' };
      it('should return true when the assessment is under six', () => {
        expect(shouldItemBeRendered(true, item)).toBeTruthy();
      });

      it('should return false when the assessment is not under six', () => {
        expect(shouldItemBeRendered(false, item)).toBeFalsy();
      });
    });

    describe('when the item has an above six id', () => {
      const item = { above_six_id: '1' };
      it('should return false when the assessment is under six', () => {
        expect(shouldItemBeRendered(true, item)).toBeFalsy();
      });

      it('should return true when the assessment is not under six', () => {
        expect(shouldItemBeRendered(false, item)).toBeTruthy();
      });
    });
  });
});
