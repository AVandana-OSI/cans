# frozen_string_literal: true

require 'infrastructure/health_checker'

module Infrastructure
  class CwdsSystemInformation
    def initialize(application)
      @application = application
    end

    def call(environment)
      request = Rack::Request.new(environment)
      return system_information if matches_system_information_path?(request)
      @application.call(environment)
    end

    private

    def system_information
      status_code, response = HealthChecker.new.check
      [status_code, { 'Content-Type' => 'application/json' }, [response]]
    end

    def matches_system_information_path?(request)
      request.path_info.include?('/system-information')
    end
  end
end
