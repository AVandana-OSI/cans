# frozen_string_literal: true

module Clients
  class ClientsRepository
    def initialize(token = nil, http_service = Infrastructure::HttpService.new)
      @token = token
      @http_service = http_service
    end

    def show(id)
      @http_service.call("/clients/#{id}", :get, @token)
    end
  end
end
