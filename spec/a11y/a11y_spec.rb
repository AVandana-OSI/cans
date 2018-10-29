# frozen_string_literal: true

require 'acceptance_helper'

feature 'Pages are accessible' do
  client = nil

  before(:all) do
    login
    client = post_new_client
  end

  after(:all) do
    logout
  end

  scenario 'Child/Youth List page is accessible' do
    visit '/'
    expect(page).to have_content 'CANS'
  end

  scenario 'Child/Youth Profile page is accessible' do
    visit "/clients/#{client['id']}"
    expect(page).to have_content 'Child/Youth Profile'
    expect(page).to be_accessible
  end

  scenario 'Add Child/Youth page is accessible' do
    visit '/clients/new'
    expect(page).to have_content 'Add Child/Youth'
    expect(page).to be_accessible
  end

  scenario 'Edit Child/Youth page is accessible' do
    visit "/clients/#{client['id']}/edit"
    expect(page).to have_content 'Edit Child/Youth'
    expect(page).to be_accessible
  end

  scenario 'Assessment Form page is accessible' do
    visit "/clients/#{client['id']}/assessments"
    expect(page).to have_content 'New CANS'
    # DatePicker's calendar popup has a lazy rendering so we have to open and close it
    # to comply with accessibility rules
    click_button 'Select date'
    click_button 'Select date'
    # Expanding one domain and one item in it to assert their accessibility
    find('#domain0-expand').click
    find('#PSYCHOSIS-item-expand').click
    expect(page).to be_accessible
  end
end
