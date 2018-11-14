# frozen_string_literal: true

SystemInformation.configure do |config|
  config.application = 'CANS'
  config.version = ENV.fetch('APP_VERSION', 'unknown').to_s
  config.checks =
    [
      { name: :redis,
        url: "redis://#{ENV.fetch('REDIS_HOST', 'localhost')}:"\
          "#{ENV.fetch('REDIS_PORT', 6379)}" },
      { name: :perry,
        url: "#{ENV.fetch('PERRY_BASE_URL', 'http://localhost/perry')}/"\
          'system-information' },
      { name: :cans_api,
        url: "#{ENV.fetch('CANS_API_BASE_URL', 'http://localhost/cans')}/"\
          'system-information' }
    ]
end