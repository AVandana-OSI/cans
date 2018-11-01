# frozen_string_literal: true

module Api
  class PeopleSearchesController < ActionController::API
    def index
      response = Dora::PersonSearchRepository
                 .search(search_params,
                         request.uuid,
                         security_token: session[:security_token])
      render json: response
    end

    private

    def search_params
      params.permit(:search_term, :is_client_only, :search_after)
    end
  end
  end
