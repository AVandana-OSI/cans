# frozen_string_literal: true

require 'spec_helper'
require 'redis'
require 'json'

module Infrastructure
  describe HealthChecker do
    describe '#initialize' do
      before do
        allow(Infrastructure::HttpService).to receive(:new).with(no_args)
        allow(Infrastructure::SecurityGateway).to receive(:new).with(no_args)
      end

      it 'sets defaults for Redis' do
        expect(Redis).to receive(:new).with(host: 'localhost', port: '6379')
        HealthChecker.new
      end

      it 'sets defaults for http service' do
        expect(Infrastructure::HttpService).to receive(:new).with(no_args)
        HealthChecker.new
      end

      it 'sets defaults for security gateway' do
        expect(Infrastructure::HttpService).to receive(:new).with(no_args)
        HealthChecker.new
      end
    end

    describe '#check' do
      let(:redis) { instance_double('Redis') }
      let(:http_service) { instance_double('Infrastructure::HttpService') }
      let(:security_gateway) { instance_double('Infrastructure::SecurityGateway') }
      let(:cans_api_response) { instance_double('Faraday::Response') }
      let(:perry_response) { instance_double('Faraday::Response') }
      let(:health_checker) { HealthChecker.new(redis, http_service, security_gateway) }

      before do
        allow(redis).to receive(:ping).with(no_args)
        allow(http_service).to receive(:call)
          .with('/system-information', :get, nil)
          .and_return(cans_api_response)
        allow(security_gateway).to receive(:health_check)
          .with(no_args)
          .and_return(perry_response)
        allow(cans_api_response).to receive(:status).and_return(200)
        allow(perry_response).to receive(:status).and_return(200)
      end

      context 'when all services are up' do
        it'returns a 200 status code' do
          status, _response = health_checker.check
          expect(status).to eq 200
        end

        it 'shows as healthy' do
          _status, response = health_checker.check
          expect(JSON.parse(response)['health_status']).to eq true
        end

        it 'returns redis success' do
          _status, response = health_checker.check
          expect(JSON.parse(response)['health_checks']['redis']['healthy']).to eq true
        end

        it 'returns cans api success' do
          _status, response = health_checker.check
          expect(JSON.parse(response)['health_checks']['cansapi']['healthy']).to eq true
        end

        it 'returns perry success' do
          _status, response = health_checker.check
          expect(JSON.parse(response)['health_checks']['perry']['healthy']).to eq true
        end
      end

      context 'when redis is down' do
        before do
          allow(redis).to receive(:ping).with(no_args).and_throw(Redis::CannotConnectError.new)
        end

        it'returns a 465 status code' do
          status, _response = health_checker.check
          expect(status).to eq 465
        end

        it 'shows as not healthy' do
          _status, response = health_checker.check
          expect(JSON.parse(response)['health_status']).to eq false
        end

        it 'returns redis failure' do
          _status, response = health_checker.check
          expect(JSON.parse(response)['health_checks']['redis']['healthy']).to eq false
        end

        it 'returns error message' do
          _status, response = health_checker.check
          message = JSON.parse(response)['health_checks']['redis']['message']
          expect(message).to match('Redis::CannotConnectError')
        end
      end

      context 'when cans api is down' do
        before do
          allow(cans_api_response).to receive(:status).and_return(500)
        end

        it'returns a 465 status code' do
          status, _response = health_checker.check
          expect(status).to eq 465
        end

        it 'shows as not healthy' do
          _status, response = health_checker.check
          expect(JSON.parse(response)['health_status']).to eq false
        end

        it 'returns a cans-api failure' do
          _status, response = health_checker.check
          expect(JSON.parse(response)['health_checks']['cansapi']['healthy']).to eq false
        end

        it 'sets an error message' do
          _status, response = health_checker.check
          message = JSON.parse(response)['health_checks']['cansapi']['message']
          expect(message).to match('cansapi returned 500')
        end
      end

      context 'when cans api raises an error' do
        before do
          allow(http_service).to receive(:call)
            .with('/system-information', :get, nil)
            .and_raise(StandardError.new('error'))
        end

        it'returns a 465 status code' do
          status, _response = health_checker.check
          expect(status).to eq 465
        end

        it 'shows as not healthy' do
          _status, response = health_checker.check
          expect(JSON.parse(response)['health_status']).to eq false
        end

        it 'returns a cans-api failure' do
          _status, response = health_checker.check
          expect(JSON.parse(response)['health_checks']['cansapi']['healthy']).to eq false
        end

        it 'sets an error message' do
          _status, response = health_checker.check
          message = JSON.parse(response)['health_checks']['cansapi']['message']
          expect(message).to match('cansapi returned error')
        end
      end

      context 'when perry is down' do
        before do
          allow(perry_response).to receive(:status).and_return(500)
        end

        it'returns a 465 status code' do
          status, _response = health_checker.check
          expect(status).to eq 465
        end

        it 'shows as not healthy' do
          _status, response = health_checker.check
          expect(JSON.parse(response)['health_status']).to eq false
        end

        it 'returns a perry failure' do
          _status, response = health_checker.check
          expect(JSON.parse(response)['health_checks']['perry']['healthy']).to eq false
        end

        it 'sets an error message' do
          _status, response = health_checker.check
          message = JSON.parse(response)['health_checks']['perry']['message']
          expect(message).to match('perry returned 500')
        end
      end

      context 'when perry raises an error' do
        before do
          allow(security_gateway).to receive(:health_check)
            .with(no_args)
            .and_raise(StandardError.new('error'))
        end

        it'returns a 465 status code' do
          status, _response = health_checker.check
          expect(status).to eq 465
        end

        it 'shows as not healthy' do
          _status, response = health_checker.check
          expect(JSON.parse(response)['health_status']).to eq false
        end

        it 'returns a perry failure' do
          _status, response = health_checker.check
          expect(JSON.parse(response)['health_checks']['perry']['healthy']).to eq false
        end

        it 'sets an error message' do
          _status, response = health_checker.check
          message = JSON.parse(response)['health_checks']['perry']['message']
          expect(message).to match('perry returned error')
        end
      end
    end
  end
end
