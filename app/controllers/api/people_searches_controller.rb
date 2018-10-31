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
      def
        params.permit(:search_term)
      end
    end
  end