# frozen_string_literal: true

require 'faker'
require 'active_support/time'

module ResourceHelper
  def post_new_client
    visit '/clients/new'
    expect(page).to have_content 'Add Child/Youth'
    client = fake_client
    fill_and_save_client_info client
    client['id'] = current_url.split('/').last
    client
  end

  def post_new_assessment(client)
    fill_and_save_assessment_form client
  end

  private

  def fake_client
    {
      'first_name' => Faker::Name.first_name,
      'last_name' => Faker::Name.last_name,
      'dob' => Faker::Date.between(20.years.ago, 10.years.ago).strftime('%m/%d/%Y'),
      'client_id' => fake_client_id,
      'case_number_0' => fake_case_number,
      'case_number_1' => fake_case_number,
      'county' => 'Ventura'
    }
  end

  def fake_client_id
    "#{Faker::Number.number(4)}-#{Faker::Number.number(4)}-"\
      "#{Faker::Number.number(4)}-#{Faker::Number.number(7)}"
  end

  def fake_case_number
    "#{Faker::Number.number(4)}-#{Faker::Number.number(3)}-"\
      "#{Faker::Number.number(4)}-#{Faker::Number.number(8)}"
  end

  def focus_and_fill_in(selector, text)
    element = find(selector)
    element.click
    element.set(text)
  end

  def fill_and_save_client_info(client)
    fill_client_info client
    click_button 'Save'
    expect(page).to have_content 'Child/Youth Profile'
  end

  # rubocop:disable Metrics/AbcSize
  def fill_client_info(client)
    fill_in('First Name', with: client['first_name'])
    fill_in('Last Name', with: client['last_name'])
    focus_and_fill_in('#dob', client['dob'])
    find('.case-numbers-single-control').click
    focus_and_fill_in('#caseNumber0', client['case_number_0'])
    focus_and_fill_in('#caseNumber1', client['case_number_1'])
    focus_and_fill_in('#external_id', client['client_id'])
    find('#county-select').find(:xpath, 'option[57]').select_option
  end
  # rubocop:enable Metrics/AbcSize

  def fill_and_save_assessment_form(client)
    click_button 'New CANS'
    behavioral_domain = [
      '#domain0-expand',
      '#PSYCHOSIS-item-expand',
      '#input-PSYCHOSIS-0-select',
      '#PSYCHOSISCheckbox',
      '#PSYCHOSIS-item-expand',
      '#IMPULSIVITY_HYPERACTIVITY-item-expand',
      '#input-IMPULSIVITY_HYPERACTIVITY-0-select',
      '#IMPULSIVITY_HYPERACTIVITYCheckbox',
      '#IMPULSIVITY_HYPERACTIVITY-item-expand',
      '#DEPRESSION-item-expand',
      '#input-DEPRESSION-0-select',
      '#DEPRESSIONCheckbox',
      '#DEPRESSION-item-expand',
      '#ANXIETY-item-expand',
      '#input-ANXIETY-0-select',
      '#ANXIETYCheckbox',
      '#ANXIETY-item-expand',
      '#OPPOSITIONAL-item-expand',
      '#input-OPPOSITIONAL-0-select',
      '#OPPOSITIONALCheckbox',
      '#OPPOSITIONAL-item-expand',
      '#CONDUCT-item-expand',
      '#input-CONDUCT-0-select',
      '#CONDUCTCheckbox',
      '#CONDUCT-item-expand',
      '#SUBSTANCE_USE-item-expand',
      '#input-SUBSTANCE_USE-0-select',
      '#SUBSTANCE_USECheckbox',
      '#SUBSTANCE_USE-item-expand',
      '#ANGER_CONTROL-item-expand',
      '#input-ANGER_CONTROL-0-select',
      '#ANGER_CONTROLCheckbox',
      '#ANGER_CONTROL-item-expand',
      '#ADJUSTMENT_TO_TRAUMA-item-expand',
      '#input-ADJUSTMENT_TO_TRAUMA-0-select',
      '#ADJUSTMENT_TO_TRAUMACheckbox',
      '#ADJUSTMENT_TO_TRAUMA-item-expand',
      '#domain0-expand'
    ]
    behavioral_domain.each { |element| find(element).click }
    click_button 'Save'
    expect(page).to have_content 'Success! CANS assessment has been saved'
    fill_and_submit_assessment_form_6_20 client
  end

  def fill_and_submit_assessment_form_6_20(client)
    fetch_life_domain
    fetch_risk_domain
    fetch_cultural_domain
    fetch_strengths_domain
    fetch_caregiver_domain
    fetch_traumatic_domain
    click_button 'Complete'
    expect(page).to have_content 'Success! CANS assessment has been completed.'
    save_assessment_form_age_0_5 client
  end

  def fetch_life_domain
    life_domain = [
      '#domain1-expand',
      '#FAMILY_FUNCTIONING-item-expand',
      '#input-FAMILY_FUNCTIONING-0-select',
      '#FAMILY_FUNCTIONINGCheckbox',
      '#FAMILY_FUNCTIONING-item-expand',
      '#LIVING_SITUATION-item-expand',
      '#input-LIVING_SITUATION-0-select',
      '#LIVING_SITUATIONCheckbox',
      '#LIVING_SITUATION-item-expand',
      '#SOCIAL_FUNCTIONING-item-expand',
      '#input-SOCIAL_FUNCTIONING-0-select',
      '#SOCIAL_FUNCTIONINGCheckbox',
      '#SOCIAL_FUNCTIONING-item-expand',
      '#DEVELOPMENTAL_INTELLECTUAL-item-expand',
      '#input-DEVELOPMENTAL_INTELLECTUAL-0-select',
      '#DEVELOPMENTAL_INTELLECTUALCheckbox',
      '#DEVELOPMENTAL_INTELLECTUAL-item-expand',
      '#DECISION_MAKING-item-expand',
      '#input-DECISION_MAKING-0-select',
      '#DECISION_MAKINGCheckbox',
      '#DECISION_MAKING-item-expand',
      '#SCHOOL_BEHAVIOR-item-expand',
      '#input-SCHOOL_BEHAVIOR-0-select',
      '#SCHOOL_BEHAVIORCheckbox',
      '#SCHOOL_BEHAVIOR-item-expand',
      '#SCHOOL_ACHIEVEMENT-item-expand',
      '#input-SCHOOL_ACHIEVEMENT-0-select',
      '#SCHOOL_ACHIEVEMENTCheckbox',
      '#SCHOOL_ACHIEVEMENT-item-expand',
      '#SCHOOL_ATTENDANCE-item-expand',
      '#input-SCHOOL_ATTENDANCE-0-select',
      '#SCHOOL_ATTENDANCECheckbox',
      '#SCHOOL_ATTENDANCE-item-expand',
      '#MEDICAL_PHYSICAL-item-expand',
      '#input-MEDICAL_PHYSICAL-0-select',
      '#MEDICAL_PHYSICALCheckbox',
      '#MEDICAL_PHYSICAL-item-expand',
      '#SEXUAL_DEVELOPMENT-item-expand',
      '#input-SEXUAL_DEVELOPMENT-0-select',
      '#SEXUAL_DEVELOPMENTCheckbox',
      '#SEXUAL_DEVELOPMENT-item-expand',
      '#SLEEP-item-expand',
      '#input-SLEEP-0-select',
      '#SLEEPCheckbox',
      '#SLEEP-item-expand'
    ]
    life_domain.each { |element| find(element).click }
  end

  def fetch_risk_domain
    risk_domain = [
      '#domain2-expand',
      '#SUICIDE_RISK-item-expand',
      '#input-SUICIDE_RISK-0-select',
      '#SUICIDE_RISKCheckbox',
      '#SUICIDE_RISK-item-expand',
      '#SELF_INJURIOUS_BEHVIOR-item-expand',
      '#input-SELF_INJURIOUS_BEHVIOR-0-select',
      '#SELF_INJURIOUS_BEHVIORCheckbox',
      '#SELF_INJURIOUS_BEHVIOR-item-expand',
      '#OTHER_SELF_HARM-item-expand',
      '#input-OTHER_SELF_HARM-0-select',
      '#OTHER_SELF_HARMCheckbox',
      '#OTHER_SELF_HARM-item-expand',
      '#DANGERS_TO_OTHERS-item-expand',
      '#input-DANGERS_TO_OTHERS-0-select',
      '#DANGERS_TO_OTHERSCheckbox',
      '#DANGERS_TO_OTHERS-item-expand',
      '#RUNAWAY-item-expand',
      '#input-RUNAWAY-0-select',
      '#RUNAWAYCheckbox',
      '#RUNAWAY-item-expand',
      '#SEXUAL_AGGRESSION-item-expand',
      '#input-SEXUAL_AGGRESSION-0-select',
      '#SEXUAL_AGGRESSIONCheckbox',
      '#SEXUAL_AGGRESSION-item-expand',
      '#DELINQUENT_BEHAVIOR-item-expand',
      '#input-DELINQUENT_BEHAVIOR-0-select',
      '#DELINQUENT_BEHAVIORCheckbox',
      '#DELINQUENT_BEHAVIOR-item-expand',
      '#INTENTIONAL_MISBEHAVIOR-item-expand',
      '#input-INTENTIONAL_MISBEHAVIOR-0-select',
      '#INTENTIONAL_MISBEHAVIORCheckbox',
      '#INTENTIONAL_MISBEHAVIOR-item-expand'
    ]
    risk_domain.each { |element| find(element).click }
  end

  def fetch_cultural_domain
    cultural_domain = [
      '#domain3-expand',
      '#LANGUAGE-item-expand',
      '#input-LANGUAGE-0-select',
      '#LANGUAGECheckbox',
      '#LANGUAGE-item-expand',
      '#TRADITIONS_RITUALS-item-expand',
      '#input-TRADITIONS_RITUALS-0-select',
      '#TRADITIONS_RITUALSCheckbox',
      '#TRADITIONS_RITUALS-item-expand',
      '#CULTURAL_STRESS-item-expand',
      '#input-CULTURAL_STRESS-0-select',
      '#CULTURAL_STRESSCheckbox',
      '#CULTURAL_STRESS-item-expand'
    ]
    cultural_domain.each { |element| find(element).click }
  end

  def fetch_strengths_domain
    strengths_domain = [
      '#domain4-expand',
      '#FAMILY_STRENGTHS-item-expand',
      '#input-FAMILY_STRENGTHS-0-select',
      '#FAMILY_STRENGTHSCheckbox',
      '#FAMILY_STRENGTHS-item-expand',
      '#INTERPERSONAL-item-expand',
      '#input-INTERPERSONAL-0-select',
      '#INTERPERSONALCheckbox',
      '#INTERPERSONAL-item-expand',
      '#EDUCATIONAL_SETTING-item-expand',
      '#input-EDUCATIONAL_SETTING-0-select',
      '#EDUCATIONAL_SETTINGCheckbox',
      '#EDUCATIONAL_SETTING-item-expand',
      '#TALENTS_INTERESTS-item-expand',
      '#input-TALENTS_INTERESTS-0-select',
      '#TALENTS_INTERESTSCheckbox',
      '#TALENTS_INTERESTS-item-expand',
      '#SPIRITUAL_RELIGIOUS-item-expand',
      '#input-SPIRITUAL_RELIGIOUS-0-select',
      '#SPIRITUAL_RELIGIOUSCheckbox',
      '#SPIRITUAL_RELIGIOUS-item-expand',
      '#CULTURAL_IDENTITY-item-expand',
      '#input-CULTURAL_IDENTITY-0-select',
      '#CULTURAL_IDENTITYCheckbox',
      '#CULTURAL_IDENTITY-item-expand',
      '#COMMUNITY_LIFE-item-expand',
      '#input-COMMUNITY_LIFE-0-select',
      '#COMMUNITY_LIFECheckbox',
      '#COMMUNITY_LIFE-item-expand',
      '#NATURAL_SUPPORTS-item-expand',
      '#input-NATURAL_SUPPORTS-0-select',
      '#NATURAL_SUPPORTSCheckbox',
      '#NATURAL_SUPPORTS-item-expand',
      '#RESILIENCY-item-expand',
      '#input-RESILIENCY-0-select',
      '#RESILIENCYCheckbox',
      '#RESILIENCY-item-expand'
    ]
    strengths_domain.each { |element| find(element).click }
  end

  def fetch_caregiver_domain
    caregiver_domain = [
      '#domain11-expand',
      '#SUPERVISION-item-expand',
      '#input-SUPERVISION-0-select',
      '#SUPERVISIONCheckbox',
      '#SUPERVISION-item-expand',
      '#INVOLVEMENT_WITH_CARE-item-expand',
      '#input-INVOLVEMENT_WITH_CARE-0-select',
      '#INVOLVEMENT_WITH_CARECheckbox',
      '#INVOLVEMENT_WITH_CARE-item-expand',
      '#KNOWLEDGE-item-expand',
      '#input-KNOWLEDGE-0-select',
      '#KNOWLEDGECheckbox',
      '#KNOWLEDGE-item-expand',
      '#SOCIAL_RESOURCES-item-expand',
      '#input-SOCIAL_RESOURCES-0-select',
      '#SOCIAL_RESOURCESCheckbox',
      '#SOCIAL_RESOURCES-item-expand',
      '#RESIDENT_STABILITY-item-expand',
      '#input-RESIDENT_STABILITY-0-select',
      '#RESIDENT_STABILITYCheckbox',
      '#RESIDENT_STABILITY-item-expand',
      '#MEDICAL_PHYSICAL_CAREGIVER-item-expand',
      '#input-MEDICAL_PHYSICAL_CAREGIVER-0-select',
      '#MEDICAL_PHYSICAL_CAREGIVERCheckbox',
      '#MEDICAL_PHYSICAL_CAREGIVER-item-expand',
      '#MENTAL_HEALTH-item-expand',
      '#input-MENTAL_HEALTH-0-select',
      '#MENTAL_HEALTHCheckbox',
      '#MENTAL_HEALTH-item-expand',
      '#SUBSTANCE_USE_CAREGIVER-item-expand',
      '#input-SUBSTANCE_USE_CAREGIVER-0-select',
      '#SUBSTANCE_USE_CAREGIVERCheckbox',
      '#SUBSTANCE_USE_CAREGIVER-item-expand',
      '#DEVELOPMENTAL-item-expand',
      '#input-DEVELOPMENTAL-0-select',
      '#DEVELOPMENTALCheckbox',
      '#DEVELOPMENTAL-item-expand',
      '#SAFETY-item-expand',
      '#input-SAFETY-0-select',
      '#SAFETYCheckbox',
      '#SAFETY-item-expand'
    ]
    caregiver_domain.each { |element| find(element).click }
  end

  def fetch_traumatic_domain
    traumatic_domain = [
      '#domain12-expand',
      '#SEXUAL_ABUSE-item-expand',
      '#input-SEXUAL_ABUSE-0-select',
      '#SEXUAL_ABUSECheckbox',
      '#SEXUAL_ABUSE-item-expand',
      '#PHYSICAL_ABUSE-item-expand',
      '#input-PHYSICAL_ABUSE-0-select',
      '#PHYSICAL_ABUSECheckbox',
      '#PHYSICAL_ABUSE-item-expand',
      '#EMOTIONAL_ABUSE-item-expand',
      '#input-EMOTIONAL_ABUSE-0-select',
      '#EMOTIONAL_ABUSECheckbox',
      '#EMOTIONAL_ABUSE-item-expand',
      '#NEGLECT-item-expand',
      '#input-NEGLECT-0-select',
      '#NEGLECTCheckbox',
      '#NEGLECT-item-expand',
      '#MEDICAL_TRAUMA-item-expand',
      '#input-MEDICAL_TRAUMA-0-select',
      '#MEDICAL_TRAUMACheckbox',
      '#MEDICAL_TRAUMA-item-expand',
      '#WITNESS_FAMILY_VIOLENCE-item-expand',
      '#input-WITNESS_FAMILY_VIOLENCE-0-select',
      '#WITNESS_FAMILY_VIOLENCECheckbox',
      '#WITNESS_FAMILY_VIOLENCE-item-expand',
      '#WITNESS_COMMUNITY_SCHOOL_VIOLENCE-item-expand',
      '#input-WITNESS_COMMUNITY_SCHOOL_VIOLENCE-0-select',
      '#WITNESS_COMMUNITY_SCHOOL_VIOLENCECheckbox',
      '#WITNESS_COMMUNITY_SCHOOL_VIOLENCE-item-expand',
      '#NATURAL_MANMADE_DISASTER-item-expand',
      '#input-NATURAL_MANMADE_DISASTER-0-select',
      '#NATURAL_MANMADE_DISASTERCheckbox',
      '#NATURAL_MANMADE_DISASTER-item-expand',
      '#WAR_TERRORISM_AFFECTED-item-expand',
      '#input-WAR_TERRORISM_AFFECTED-0-select',
      '#WAR_TERRORISM_AFFECTEDCheckbox',
      '#WAR_TERRORISM_AFFECTED-item-expand',
      '#VICTIM_WITNESS_CRIMINAL_ACTIVITY-item-expand',
      '#input-VICTIM_WITNESS_CRIMINAL_ACTIVITY-0-select',
      '#VICTIM_WITNESS_CRIMINAL_ACTIVITYCheckbox',
      '#VICTIM_WITNESS_CRIMINAL_ACTIVITY-item-expand',
      '#DISRUPTIONS_CG_ATTACHMENT_LOSSES-item-expand',
      '#input-DISRUPTIONS_CG_ATTACHMENT_LOSSES-0-select',
      '#DISRUPTIONS_CG_ATTACHMENT_LOSSESCheckbox',
      '#DISRUPTIONS_CG_ATTACHMENT_LOSSES-item-expand',
      '#CG_CRIMINAL_BEHAVIOR-item-expand',
      '#input-CG_CRIMINAL_BEHAVIOR-0-select',
      '#CG_CRIMINAL_BEHAVIORCheckbox',
      '#CG_CRIMINAL_BEHAVIOR-item-expand'
    ]
    traumatic_domain.each { |element| find(element).click }
  end

  def save_assessment_form_age_0_5(client)
    click_button 'New CANS'
    click_button 'Save'
    expect(page).to have_content 'Success! CANS assessment has been saved'
    fill_and_complete_assessment_form_age_0_5 client
  end

  def fill_and_complete_assessment_form_age_0_5(_client)
    fetch_challenges_domain
    fetch_functioning_domain
    fetch_risk_behaviors_domain
    fetch_cultural_factors_domain
    fetch_minor_strengths_domain
    fetch_dyadic_domain
    fetch_caregiver_resources_domain
    fetch_minor_traumatic_domain
    click_button 'Complete'
  end

  def fetch_challenges_domain
    challenges_domain = [
      '#age-switch',
      '#domain5-expand',
      '#IMPULSIVITY_HYPERACTIVITY-item-expand',
      '#input-IMPULSIVITY_HYPERACTIVITY-0-select',
      '#IMPULSIVITY_HYPERACTIVITYCheckbox',
      '#IMPULSIVITY_HYPERACTIVITY-item-expand',
      '#DEPRESSION-item-expand',
      '#input-DEPRESSION-0-select',
      '#DEPRESSIONCheckbox',
      '#DEPRESSION-item-expand',
      '#ANXIETY-item-expand',
      '#input-ANXIETY-0-select',
      '#ANXIETYCheckbox',
      '#ANXIETY-item-expand',
      '#OPPOSITIONAL-item-expand',
      '#input-OPPOSITIONAL-0-select',
      '#OPPOSITIONALCheckbox',
      '#OPPOSITIONAL-item-expand',
      '#ADJUSTMENT_TO_TRAUMA-item-expand',
      '#input-ADJUSTMENT_TO_TRAUMA-0-select',
      '#ADJUSTMENT_TO_TRAUMACheckbox',
      '#ADJUSTMENT_TO_TRAUMA-item-expand',
      '#ATTACHMENT_DIFFICULTIES-item-expand',
      '#input-ATTACHMENT_DIFFICULTIES-0-select',
      '#ATTACHMENT_DIFFICULTIESCheckbox',
      '#ATTACHMENT_DIFFICULTIES-item-expand',
      '#REGULATORY-item-expand',
      '#input-REGULATORY-0-select',
      '#REGULATORYCheckbox',
      '#REGULATORY-item-expand',
      '#ATYPICAL_BEHAVIORS-item-expand',
      '#input-ATYPICAL_BEHAVIORS-0-select',
      '#ATYPICAL_BEHAVIORSCheckbox',
      '#ATYPICAL_BEHAVIORS-item-expand',
      '#SLEEP_CHILD-item-expand',
      '#input-SLEEP_CHILD-0-select',
      '#SLEEP_CHILDCheckbox',
      '#SLEEP_CHILD-item-expand'
    ]
    challenges_domain.each { |element| find(element).click }
  end

  def fetch_functioning_domain
    functioning_domain = [
      '#domain6-expand',
      '#FAMILY_FUNCTIONING-item-expand',
      '#input-FAMILY_FUNCTIONING-0-select',
      '#FAMILY_FUNCTIONINGCheckbox',
      '#FAMILY_FUNCTIONING-item-expand',
      '#EARLY_EDUCATION-item-expand',
      '#input-EARLY_EDUCATION-0-select',
      '#EARLY_EDUCATIONCheckbox',
      '#EARLY_EDUCATION-item-expand',
      '#SOCIAL_EMOTIONAL_FUNCTIONING-item-expand',
      '#input-SOCIAL_EMOTIONAL_FUNCTIONING-0-select',
      '#SOCIAL_EMOTIONAL_FUNCTIONINGCheckbox',
      '#SOCIAL_EMOTIONAL_FUNCTIONING-item-expand',
      '#DEVELOPMENTAL_INTELLECTUAL-item-expand',
      '#input-DEVELOPMENTAL_INTELLECTUAL-0-select',
      '#DEVELOPMENTAL_INTELLECTUALCheckbox',
      '#DEVELOPMENTAL_INTELLECTUAL-item-expand',
      '#MEDICAL_PHYSICAL-item-expand',
      '#input-MEDICAL_PHYSICAL-0-select',
      '#MEDICAL_PHYSICALCheckbox',
      '#MEDICAL_PHYSICAL-item-expand'
    ]
    functioning_domain.each { |element| find(element).click }
  end

  def fetch_risk_behaviors_domain
    risk_behaviors_domain = [
      '#domain7-expand',
      '#SELF_HARM-item-expand',
      '#input-SELF_HARM-0-select',
      '#SELF_HARMCheckbox',
      '#SELF_HARM-item-expand',
      '#EXPLOITED-item-expand',
      '#input-EXPLOITED-0-select',
      '#EXPLOITEDCheckbox',
      '#EXPLOITED-item-expand',
      '#PRENATAL_CARE-item-expand',
      '#input-PRENATAL_CARE-0-select',
      '#PRENATAL_CARECheckbox',
      '#PRENATAL_CARE-item-expand',
      '#EXPOSURE-item-expand',
      '#input-EXPOSURE-0-select',
      '#EXPOSURECheckbox',
      '#EXPOSURE-item-expand',
      '#LABOR_DELIVERY-item-expand',
      '#input-LABOR_DELIVERY-0-select',
      '#LABOR_DELIVERYCheckbox',
      '#LABOR_DELIVERY-item-expand',
      '#BIRTH_WEIGHT-item-expand',
      '#input-BIRTH_WEIGHT-0-select',
      '#BIRTH_WEIGHTCheckbox',
      '#BIRTH_WEIGHT-item-expand',
      '#FAILURE_TO_THRIVE-item-expand',
      '#input-FAILURE_TO_THRIVE-0-select',
      '#FAILURE_TO_THRIVECheckbox',
      '#FAILURE_TO_THRIVE-item-expand'
    ]
    risk_behaviors_domain.each { |element| find(element).click }
  end

  def fetch_cultural_factors_domain
    cultural_factors_domain = [
      '#domain8-expand',
      '#LANGUAGE-item-expand',
      '#input-LANGUAGE-0-select',
      '#LANGUAGECheckbox',
      '#LANGUAGE-item-expand',
      '#TRADITIONS_RITUALS-item-expand',
      '#input-TRADITIONS_RITUALS-0-select',
      '#TRADITIONS_RITUALSCheckbox',
      '#TRADITIONS_RITUALS-item-expand',
      '#CULTURAL_STRESS-item-expand',
      '#input-CULTURAL_STRESS-0-select',
      '#CULTURAL_STRESSCheckbox',
      '#CULTURAL_STRESS-item-expand'
    ]
    cultural_factors_domain.each { |element| find(element).click }
  end

  def fetch_minor_strengths_domain
    strengths_domain = [
      '#domain9-expand',
      '#FAMILY_STRENGTHS-item-expand',
      '#input-FAMILY_STRENGTHS-0-select',
      '#FAMILY_STRENGTHSCheckbox',
      '#FAMILY_STRENGTHS-item-expand',
      '#INTERPERSONAL-item-expand',
      '#input-INTERPERSONAL-0-select',
      '#INTERPERSONALCheckbox',
      '#INTERPERSONAL-item-expand',
      '#NATURAL_SUPPORTS-item-expand',
      '#input-NATURAL_SUPPORTS-0-select',
      '#NATURAL_SUPPORTSCheckbox',
      '#NATURAL_SUPPORTS-item-expand',
      '#RESILIENCY-item-expand',
      '#input-RESILIENCY-0-select',
      '#RESILIENCYCheckbox',
      '#RESILIENCY-item-expand',
      '#RELATIONSHIP_PERMANENCE-item-expand',
      '#input-RELATIONSHIP_PERMANENCE-0-select',
      '#RELATIONSHIP_PERMANENCECheckbox',
      '#RELATIONSHIP_PERMANENCE-item-expand',
      '#PLAYFULLNESS-item-expand',
      '#input-PLAYFULLNESS-0-select',
      '#PLAYFULLNESSCheckbox',
      '#PLAYFULLNESS-item-expand',
      '#FAMILY_SPRITUAL_RELIGIOUS-item-expand',
      '#input-FAMILY_SPRITUAL_RELIGIOUS-0-select',
      '#FAMILY_SPRITUAL_RELIGIOUSCheckbox',
      '#FAMILY_SPRITUAL_RELIGIOUS-item-expand'
    ]
    strengths_domain.each { |element| find(element).click }
  end

  def fetch_dyadic_domain
    dyadic_domain = [
      '#domain10-expand',
      '#CAREGIVER_EMOTIONAL_RESPONSIVENESS-item-expand',
      '#input-CAREGIVER_EMOTIONAL_RESPONSIVENESS-0-select',
      '#CAREGIVER_EMOTIONAL_RESPONSIVENESSCheckbox',
      '#CAREGIVER_EMOTIONAL_RESPONSIVENESS-item-expand',
      '#CAREGIVER_ADJ_TRAUMA_EXP-item-expand',
      '#input-CAREGIVER_ADJ_TRAUMA_EXP-0-select',
      '#CAREGIVER_ADJ_TRAUMA_EXPCheckbox',
      '#CAREGIVER_ADJ_TRAUMA_EXP-item-expand'
    ]
    dyadic_domain.each { |element| find(element).click }
  end

  def fetch_caregiver_resources_domain
    caregiver_resources_domain = [
      '#domain11-expand',
      '#SUPERVISION-item-expand',
      '#input-SUPERVISION-0-select',
      '#SUPERVISIONCheckbox',
      '#SUPERVISION-item-expand',
      '#INVOLVEMENT_WITH_CARE-item-expand',
      '#input-INVOLVEMENT_WITH_CARE-0-select',
      '#INVOLVEMENT_WITH_CARECheckbox',
      '#INVOLVEMENT_WITH_CARE-item-expand',
      '#KNOWLEDGE-item-expand',
      '#input-KNOWLEDGE-0-select',
      '#KNOWLEDGECheckbox',
      '#KNOWLEDGE-item-expand',
      '#SOCIAL_RESOURCES-item-expand',
      '#input-SOCIAL_RESOURCES-0-select',
      '#SOCIAL_RESOURCESCheckbox',
      '#SOCIAL_RESOURCES-item-expand',
      '#RESIDENT_STABILITY-item-expand',
      '#input-RESIDENT_STABILITY-0-select',
      '#RESIDENT_STABILITYCheckbox',
      '#RESIDENT_STABILITY-item-expand',
      '#MEDICAL_PHYSICAL_CAREGIVER-item-expand',
      '#input-MEDICAL_PHYSICAL_CAREGIVER-0-select',
      '#MEDICAL_PHYSICAL_CAREGIVERCheckbox',
      '#MEDICAL_PHYSICAL_CAREGIVER-item-expand',
      '#MENTAL_HEALTH-item-expand',
      '#input-MENTAL_HEALTH-0-select',
      '#MENTAL_HEALTHCheckbox',
      '#MENTAL_HEALTH-item-expand',
      '#SUBSTANCE_USE_CAREGIVER-item-expand',
      '#input-SUBSTANCE_USE_CAREGIVER-0-select',
      '#SUBSTANCE_USE_CAREGIVERCheckbox',
      '#SUBSTANCE_USE_CAREGIVER-item-expand',
      '#DEVELOPMENTAL-item-expand',
      '#input-DEVELOPMENTAL-0-select',
      '#DEVELOPMENTALCheckbox',
      '#DEVELOPMENTAL-item-expand',
      '#SAFETY-item-expand',
      '#input-SAFETY-0-select',
      '#SAFETYCheckbox',
      '#SAFETY-item-expand',
      '#FAMILY_RELATIONSHIP_TO_SYSTEM-item-expand',
      '#input-FAMILY_RELATIONSHIP_TO_SYSTEM-0-select',
      '#FAMILY_RELATIONSHIP_TO_SYSTEMCheckbox',
      '#FAMILY_RELATIONSHIP_TO_SYSTEM-item-expand',
      '#LEGAL_INVOLVEMENT-item-expand',
      '#input-LEGAL_INVOLVEMENT-0-select',
      '#LEGAL_INVOLVEMENTCheckbox',
      '#LEGAL_INVOLVEMENT-item-expand',
      '#ORGANIZATION-item-expand',
      '#input-ORGANIZATION-0-select',
      '#ORGANIZATIONCheckbox',
      '#ORGANIZATION-item-expand'
    ]
    caregiver_resources_domain.each { |element| find(element).click }
  end

  def fetch_minor_traumatic_domain
    traumatic_domain = [
      '#domain12-expand',
      '#SEXUAL_ABUSE-item-expand',
      '#input-SEXUAL_ABUSE-0-select',
      '#SEXUAL_ABUSECheckbox',
      '#SEXUAL_ABUSE-item-expand',
      '#PHYSICAL_ABUSE-item-expand',
      '#input-PHYSICAL_ABUSE-0-select',
      '#PHYSICAL_ABUSECheckbox',
      '#PHYSICAL_ABUSE-item-expand',
      '#EMOTIONAL_ABUSE-item-expand',
      '#input-EMOTIONAL_ABUSE-0-select',
      '#EMOTIONAL_ABUSECheckbox',
      '#EMOTIONAL_ABUSE-item-expand',
      '#NEGLECT-item-expand',
      '#input-NEGLECT-0-select',
      '#NEGLECTCheckbox',
      '#NEGLECT-item-expand',
      '#MEDICAL_TRAUMA-item-expand',
      '#input-MEDICAL_TRAUMA-0-select',
      '#MEDICAL_TRAUMACheckbox',
      '#MEDICAL_TRAUMA-item-expand',
      '#WITNESS_FAMILY_VIOLENCE-item-expand',
      '#input-WITNESS_FAMILY_VIOLENCE-0-select',
      '#WITNESS_FAMILY_VIOLENCECheckbox',
      '#WITNESS_FAMILY_VIOLENCE-item-expand',
      '#WITNESS_COMMUNITY_SCHOOL_VIOLENCE-item-expand',
      '#input-WITNESS_COMMUNITY_SCHOOL_VIOLENCE-0-select',
      '#WITNESS_COMMUNITY_SCHOOL_VIOLENCECheckbox',
      '#WITNESS_COMMUNITY_SCHOOL_VIOLENCE-item-expand',
      '#NATURAL_MANMADE_DISASTER-item-expand',
      '#input-NATURAL_MANMADE_DISASTER-0-select',
      '#NATURAL_MANMADE_DISASTERCheckbox',
      '#NATURAL_MANMADE_DISASTER-item-expand',
      '#WAR_TERRORISM_AFFECTED-item-expand',
      '#input-WAR_TERRORISM_AFFECTED-0-select',
      '#WAR_TERRORISM_AFFECTEDCheckbox',
      '#WAR_TERRORISM_AFFECTED-item-expand',
      '#VICTIM_WITNESS_CRIMINAL_ACTIVITY-item-expand',
      '#input-VICTIM_WITNESS_CRIMINAL_ACTIVITY-0-select',
      '#VICTIM_WITNESS_CRIMINAL_ACTIVITYCheckbox',
      '#VICTIM_WITNESS_CRIMINAL_ACTIVITY-item-expand',
      '#DISRUPTIONS_CG_ATTACHMENT_LOSSES-item-expand',
      '#input-DISRUPTIONS_CG_ATTACHMENT_LOSSES-0-select',
      '#DISRUPTIONS_CG_ATTACHMENT_LOSSESCheckbox',
      '#DISRUPTIONS_CG_ATTACHMENT_LOSSES-item-expand',
      '#CG_CRIMINAL_BEHAVIOR-item-expand',
      '#input-CG_CRIMINAL_BEHAVIOR-0-select',
      '#CG_CRIMINAL_BEHAVIORCheckbox',
      '#CG_CRIMINAL_BEHAVIOR-item-expand'
    ]
    traumatic_domain.each { |element| find(element).click }
  end
end
