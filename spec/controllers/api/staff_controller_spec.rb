# frozen_string_literal: true

require 'rails_helper'

module Api
  describe StaffController do
    let(:staff_repository) { instance_double('Staff::StaffRepository') }

    describe '#subordinates_index' do
      let(:subordinates) do
        [{
          id: 0,
          staff_person: {
            id: 0,
            identifier: 'string',
            first_name: 'string',
            last_name: 'string',
            phone_number: 'string',
            email: 'string'
          },
          in_progress_count: 0,
          submitted_count: 0
        }]
      end
      let(:subordinates_response) do
        instance_double('Faraday::Response', body: subordinates, status: 200)
      end

      it 'returns response with subordinates' do
        request.session[:token] = 'token'
        allow(Staff::StaffRepository).to receive(:new)
          .with('token')
          .and_return(staff_repository)
        allow(staff_repository).to receive(:subordinates_index)
          .with(no_args)
          .and_return(subordinates_response)
        get :subordinates_index
        expect(response.status).to eq 200
        expect(response.body).to eq subordinates.to_json
      end
    end
  end
end
