# frozen_string_literal: true

module Assessments
  class AssessmentsRepository
    def initialize(token = nil, http_service = Infrastructure::HttpService.new)
      @token = token
      @http_service = http_service
    end

    def show(id)
      @http_service.call("/assessments/#{id}", :get, @token)
    end

    def search(payload)
      @http_service.call('/assessments/_search', :post, @token, payload)
    end

    def create(payload)
      @http_service.call('/assessments', :post, @token, payload)
    end

    def update(id, payload)
      @http_service.call("/assessments/#{id}", :put, @token, payload)
    end
  end
end
