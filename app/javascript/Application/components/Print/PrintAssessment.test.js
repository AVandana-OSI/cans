import React from 'react'
import { shallow } from 'enzyme'
import PrintAssessment from './PrintAssessment'
import { assessmentPrint, i18nPrint, printFixture } from '../Assessment/assessment.mocks.test'

describe('<PrintAssessment />', () => {
  it('should match fixture as plain html', () => {
    const printAssessment = shallow(<PrintAssessment assessment={assessmentPrint} i18n={i18nPrint} />)
    const actualHtmlRaw = printAssessment.html()
    const actualHtml = actualHtmlRaw.replace(
      /<span style="text-align:right;font-style:italic">[^>]+<\/span>/g,
      '<span style="text-align:right;font-style:italic" />'
    )
    expect(actualHtml).toEqual(printFixture)
  })
})
