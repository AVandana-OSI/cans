# frozen_string_literal: true

require 'acceptance_helper'

feature 'Assessment Page' do
  scenario 'can fill and complete assessment' do
    login
    #
    # Need to be reworked according to the last changes.
    # Client can not be created separately.
    #
    # client = post_new_client
    # post_new_assessment client
    # expect(page).to have_content 'Success! CANS assessment has been completed.'
  end
end
