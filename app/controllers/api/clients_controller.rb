# frozen_string_literal: true

module Api
  class ClientsController < ActionController::API
    def show
      response = Clients::ClientsRepository.new(session[:token]).show(params[:id])
      render json: response.body, status: response.status
    end
  end
end
