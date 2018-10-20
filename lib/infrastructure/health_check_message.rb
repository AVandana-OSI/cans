# frozen_string_literal: true

module Infrastructure
  class HealthCheckMessage
    attr_reader :application
    attr_reader :version
    attr_reader :health_status
    attr_reader :health_checks

    def initialize(health_status, health_checks)
      @application = 'CANS Web'
      @version = ENV.fetch('APP_VERSION', 'unknown')
      @health_status = health_status
      @health_checks = health_checks
    end

    def status_code
      @health_status ? ok_http_status_code : cwds_http_error_status_code
    end

    def to_json
      {
        application: application,
        version: version,
        health_status: health_status,
        health_checks: health_checks_collection
      }.to_json
    end

    private

    def health_checks_collection
      health_checks.each_with_object({}) do |check, checks|
        checks[check.name.to_sym] = check.values
      end
    end

    def ok_http_status_code
      200
    end

    def cwds_http_error_status_code
      465
    end
  end
end
