# frozen_string_literal: true

require 'rails_helper'

module Infrastructure
  describe SecurityGateway do
    let(:security_gateway) { SecurityGateway.new }
    let(:response) { instance_double('Faraday::Response') }

    describe '#validate_token' do
      context 'with a valid token' do
        it 'returns true' do
          allow(response).to receive(:status).and_return(200)
          allow(response).to receive(:body).and_return('json')
          allow(Faraday).to receive(:get)
            .with('https://perry.test:8080/authn/validate?token=valid_token')
            .and_return(response)
          expect(security_gateway.validate_token('valid_token')).to eq 'json'
        end
      end

      context 'with an invalid token' do
        it 'returns false' do
          allow(response).to receive(:status).and_return(401)
          allow(Faraday).to receive(:get)
            .with('https://perry.test:8080/authn/validate?token=invalid_token')
            .and_return(response)
          expect(security_gateway.validate_token('invalid_token')).to eq nil
        end
      end
    end

    describe '#fetch_new_token' do
      context 'with a valid access code' do
        it 'returns a valid token' do
          allow(response).to receive(:status).and_return(200)
          allow(response).to receive(:body).and_return('token')
          allow(Faraday).to receive(:get)
            .with('https://perry.test:8080/authn/token?accessCode=someCode')
            .and_return(response)
          expect(security_gateway.fetch_new_token('someCode')).to eq 'token'
        end
      end

      context 'with a invalid access code' do
        it 'returns nil' do
          allow(response).to receive(:status).and_return(401)
          allow(Faraday).to receive(:get)
            .with('https://perry.test:8080/authn/token?accessCode=badCode')
            .and_return(response)
          expect(security_gateway.fetch_new_token('badCode')).to eq nil
        end
      end
    end
  end
end
