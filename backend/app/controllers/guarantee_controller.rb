require "net/http"

class GuaranteeController < ApplicationController
  GUARANTEES_URL = "#{Rails.application.credentials.alarmbox[:api_base_url]}/gt/v1/guarantees"

  # GET /guarantees
  # アラームボックスから保証一覧を取得
  def index
    access_token = request.headers["Authorization"]&.split(" ")&.last

    unless access_token
      render json: { error: "アクセストークンが必要です" }, status: :unauthorized
      return
    end

    response = fetch_guarantees(access_token)
    data = JSON.parse(response.body)

    if response.is_a?(Net::HTTPSuccess)
      render json: data
    else
      render json: { error: data["error_description"] || "保証一覧の取得に失敗しました" }, status: :bad_gateway
    end
  end

  private

  def fetch_guarantees(access_token)
    uri = URI.parse(GUARANTEES_URL)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(uri.path)
    request["Authorization"] = "Bearer #{access_token}"
    http.request(request)
  end
end
