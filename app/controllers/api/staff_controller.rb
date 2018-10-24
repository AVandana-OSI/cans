# frozen_string_literal: true

module Api
  class StaffController < ActionController::API
    def subordinates_index
      response = Staff::StaffRepository.new(session[:token]).subordinates_index
      render json: response.body, status: response.status
    end
  end
end
