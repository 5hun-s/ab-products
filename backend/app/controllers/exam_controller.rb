require "net/http"

class ExamController < ApplicationController
  EXAMS_URL = "#{Rails.application.credentials.alarmbox[:api_base_url]}/gt/v1/exams"

  # GET /exams
  # アラームボックスから審査一覧を取得
  def index
    access_token = request.headers["Authorization"]&.split(" ")&.last

    unless access_token
      render json: { error: "アクセストークンが必要です" }, status: :unauthorized
      return
    end

    response = fetch_exams(access_token)
    data = JSON.parse(response.body)

    if response.is_a?(Net::HTTPSuccess)
      render json: data
    else
      render json: { error: data["error_description"] || "審査一覧の取得に失敗しました" }, status: :bad_gateway
    end
  end

  def create
    access_token = request.headers["Authorization"]&.split(" ")&.last

    unless access_token
      render json: { error: "アクセストークンが必要です" }, status: :unauthorized
      return
    end

    exam_params = params.expect(exam: [:company_name, :representative_name, :address, :corporation_number, :guarantee_amount_hope])

    response = post_exam(access_token, exam_params.to_h)
    data = JSON.parse(response.body)

    if response.is_a?(Net::HTTPSuccess)
      render json: data, status: :created
    else
      Rails.logger.error("AlarmBox POST /exams error: #{response.code} #{response.body}")
      render json: { error: data["error_description"] || data["message"] || data["error"] || "審査依頼の登録に失敗しました" }, status: :bad_gateway
    end
  end

  private

  def fetch_exams(access_token)
    uri = URI.parse(EXAMS_URL)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(uri.path)
    request["Authorization"] = "Bearer #{access_token}"
    http.request(request)
  end

  def post_exam(access_token, body)
    uri = URI.parse(EXAMS_URL)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.path)
    request["Authorization"] = "Bearer #{access_token}"
    request["Content-Type"] = "application/json"
    request.body = body.to_json
    http.request(request)
  end
end
