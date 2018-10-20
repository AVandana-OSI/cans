# frozen_string_literal: true

require 'acceptance_helper'

feature 'Assessment Page' do
  scenario 'can fill and submit assessment' do
    login
    client = post_new_client
    post_new_assessment client
    expect(page).to have_content 'Success! CANS assessment has been submitted.'
  end
end
