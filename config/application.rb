require_relative 'boot'

require "active_storage/engine"
require "action_controller/railtie"
require "action_view/railtie"
require "action_mailer/railtie"
require "active_job/railtie"
require "action_cable/engine"
require "rails/test_unit/railtie"
require "sprockets/railtie"
# To enable db connection uncomment this line
# require "active_record/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Cans
  class Application < Rails::Application
    require 'infrastructure/cwds_authenticator'
    require 'infrastructure/cwds_permission_checker'
    require 'infrastructure/api_middleware'
    require 'infrastructure/timeout_middleware'

    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2
    config.autoload_paths << Rails.root.join('lib')
    config.eager_load_paths << Rails.root.join('lib')

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    config.middleware.use SystemInformation::SystemInformationMiddleware
    config.middleware.insert_after(SystemInformation::SystemInformationMiddleware, Infrastructure::CwdsAuthenticator)
    config.middleware.insert_after(Infrastructure::CwdsAuthenticator, Infrastructure::CwdsPermissionChecker)
    config.middleware.insert_after(Infrastructure::CwdsPermissionChecker, Infrastructure::ApiMiddleware)
    config.middleware.insert_after(Infrastructure::ApiMiddleware, Infrastructure::TimeoutMiddleware)
    config.micro_services = config_for(:micro_services)
    config.relative_url_root = ENV['CANS_BASE_PATH'] || '/'
    config.assets.prefix = "#{ENV['CANS_BASE_PATH']}/packs"
  end
end
