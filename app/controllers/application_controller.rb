# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :authenticate_user

  def fallback_index_html
    @data = { foo: 'bar' }
  end

  private

  def authenticate_user
    security_token = Dora::SecurityRepository.retrieve_security_token(
      access_code: params[:accessCode]
    )
    session.delete(:security_token) if security_token
    return if session[:security_token]

    process_token(security_token)
  end 
  
  def process_token(security_token)
    auth_artifact = Dora::SecurityRepository.auth_artifact_for_token(security_token)
    if auth_artifact
      session[:security_token] = security_token
      return unless json?(auth_artifact)
      assign_and_log_user_details(auth_artifact, security_token)
    else
      redirect_to Dora::SecurityRepository.login_url(request.original_url)
    end
  end
  
  def json?(json_candidate)
    JSON.parse(json_candidate)
    true
  rescue StandardError
    false
  end

  def assign_and_log_user_details(auth_artifact, security_token)
    auth_data = JSON.parse(auth_artifact)
    staff_id = auth_data['staff_id']
    set_user_details_on_session(security_token, staff_id, auth_data)
    Rails.logger.info("User Authenticated: #{staff_id}")
  end
  
  def set_user_details_on_session(security_token, staff_id, auth_data)
    return unless staff_id
    begin
      session[:user_details] = Dora::StaffRepository.find(security_token, request.uuid, staff_id)
    rescue StandardError
      session[:user_details] = Staff.new(staff_id: staff_id).instance_variables
    end
    session[:user_details]['privileges'] = auth_data['privileges']
  end  
end
