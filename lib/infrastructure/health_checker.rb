# frozen_string_literal: true

module Infrastructure
  class HealthChecker
    def initialize(redis = Redis.new(host: ENV.fetch('REDIS_HOST', 'localhost'),
                                     port: ENV.fetch('REDIS_PORT', '6379')),
                   http_service = ::Infrastructure::HttpService.new,
                   security_gateway = ::Infrastructure::SecurityGateway.new)
      @redis = redis
      @http_service = http_service
      @security_gateway = security_gateway
    end

    def check
      health_checks = []
      health_checks << redis_check
      health_checks << cans_api_check
      health_checks << perry_check
      health_check_message = HealthCheckMessage.new(overall_health(health_checks), health_checks)
      [health_check_message.status_code, health_check_message.to_json]
    end

    private

    def overall_health(health_checks)
      health_checks.map(&:healthy).reduce(:&)
    end

    def redis_check
      item = HealthCheckItem.new(:redis, true)
      begin
        @redis.ping
      rescue StandardError => error
        set_error_status(item, error.message)
      end
      item
    end

    def cans_api_check
      item = HealthCheckItem.new(:cansapi, true)
      begin
        response = @http_service.call('/system-information', :get, nil)
        set_error_status(item, response.status) unless response.status == 200
      rescue StandardError => error
        set_error_status(item, error.message)
      end
      item
    end

    def perry_check
      item = HealthCheckItem.new(:perry, true)
      begin
        response = @security_gateway.health_check
        set_error_status(item, response.status) unless response.status == 200
      rescue StandardError => error
        set_error_status(item, error.message)
      end
      item
    end

    def set_error_status(item, message)
      item.healthy = false
      item.message = "#{item.name} returned #{message}"
    end
  end
end
