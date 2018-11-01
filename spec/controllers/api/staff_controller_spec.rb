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

    describe '#social_worker_clients' do
      let(:user_id) { 100 }
      let(:clients) { [{ id: 1, first_name: 'Jim' }, { id: 2, first_name: 'Mike' }] }
      let(:clients_response) do
        instance_double('Faraday::Response', body: clients, status: 200)
      end

      it 'returns clients assigned to the social worker' do
        request.session[:token] = 'token'
        allow(Staff::StaffRepository).to receive(:new)
          .with('token')
          .and_return(staff_repository)
        allow(staff_repository)
          .to receive(:social_worker_clients)
          .with('100')
          .and_return(clients_response)
        get :social_worker_clients, params: { id: 100 }
        expect(response.body).to eq clients.to_json
      end
    end

    describe '#assessments' do
      let(:assessments) do
        [
          {
            id: 0,
            instrument_id: 0,
            person: {
              id: 0,
              person_role: 'string',
              first_name: 'string',
              middle_name: 'string',
              last_name: 'string',
              suffix: 'string',
              identifier: 'string',
              external_id: 'string',
              dob: 'string',
              metadata: {
                editable: true
              },
              county: {
                id: 0,
                name: 'string',
                external_id: 'string',
                export_id: 'string'
              },
              cases: [{
                id: 0,
                external_id: 'string',
                created_by: {
                  id: 0,
                  person_role: 'string',
                  external_id: 'string',
                  metadata: {
                    editable: true
                  },
                  cases: []
                },
                created_timestamp: 'string'
              }]
            }
          }
        ]
      end
      let(:assessments_response) do
        instance_double('Faraday::Response', body: assessments, status: 200)
      end

      it 'returns response with assessments' do
        request.session[:token] = 'token'
        allow(Staff::StaffRepository).to receive(:new)
          .with('token')
          .and_return(staff_repository)
        allow(staff_repository).to receive(:assessments)
          .with(no_args)
          .and_return(assessments_response)
        get :assessments
        expect(response.status).to eq 200
        expect(response.body).to eq assessments.to_json
      end
    end
  end
end
