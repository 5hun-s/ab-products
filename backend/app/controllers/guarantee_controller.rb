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

  def create
    access_token = request.headers["Authorization"]&.split(" ")&.last

    unless access_token
      render json: { error: "アクセストークンが必要です" }, status: :unauthorized
      return
    end

    guarantee_params = params.expect(guarantee: [
      :exam_id, :management_number, :corporation_number,
      :guarantee_amount_hope, :guarantee_start_at, :guarantee_end_at,
      :auto_increment, :end_of_guarantee_request
    ])

    response = post_guarantee(access_token, guarantee_params.to_h)
    data = JSON.parse(response.body)

    if response.is_a?(Net::HTTPSuccess)
      render json: data, status: :created
    else
      Rails.logger.error("AlarmBox POST /guarantees error: #{response.code} #{response.body}")
      render json: { error: data["error_description"] || data["message"] || data["error"] || "保証依頼の登録に失敗しました" }, status: :bad_gateway
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

  def post_guarantee(access_token, body)
    uri = URI.parse(GUARANTEES_URL)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.path)
    request["Authorization"] = "Bearer #{access_token}"
    request["Content-Type"] = "application/json"
    request.body = body.to_json
    http.request(request)
  end
end
