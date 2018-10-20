# frozen_string_literal: true

require 'rails_helper'

module Infrastructure
  describe CwdsSystemInformation do
    describe '#call' do
      let(:application) { instance_double('ActionDispatch::Routing::RouteSet') }
      let(:cwds_system_information) { CwdsSystemInformation.new(application) }

      context 'when /system-information' do
        let(:health_checker) { instance_double('Infrastructure::HealthChecker') }
        let(:health_check_response) { [200, { application: 'CANS' }.to_json] }
        let(:environment) do
          Rack::MockRequest.env_for('http://example.com/cans/system-information', {})
        end

        before do
          allow(HealthChecker).to receive(:new).and_return(health_checker)
          allow(health_checker).to receive(:check).and_return(health_check_response)
        end

        it 'returns status code' do
          status, _headers, _body = cwds_system_information.call(environment)
          expect(status).to eq 200
        end

        it 'returns an application/javascript header' do
          _status, headers, _body = cwds_system_information.call(environment)
          expect(headers).to eq 'Content-Type' => 'application/json'
        end

        it 'returns a json payload' do
          _status, _headers, body = cwds_system_information.call(environment)
          expect(body).to eq([{ application: 'CANS' }.to_json])
        end
      end

      context 'when not /system-information' do
        let(:environment) do
          Rack::MockRequest.env_for('http://example.com/cans/fetch_stuff', {})
        end

        it 'passes along the request unchanged' do
          expect(application).to receive(:call).with(environment)
          cwds_system_information.call(environment)
        end
      end
    end
  end
end
