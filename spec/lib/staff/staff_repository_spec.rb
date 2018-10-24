# frozen_string_literal: true

require 'spec_helper'

module Staff
  describe StaffRepository do
    let(:http_service) { instance_double('Infrastructure::HttpService') }
    let(:token) { 'security_token' }
    let(:staff_repository) { StaffRepository.new(token, http_service) }
    let(:response) { Faraday::Response.new }

    describe '#subordinates_index' do
      it 'returns staff people' do
        allow(http_service).to receive(:call)
          .with('/staff/subordinates', :get, token)
          .and_return(response)
        expect(staff_repository.subordinates_index).to eq(response)
      end
    end
  end
end
