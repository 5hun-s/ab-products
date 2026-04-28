require "net/http"

class Auth::AlarmboxController < ApplicationController
  AUTHORIZE_URL = "#{Rails.application.credentials.alarmbox[:api_base_url]}/oauth/authorize"
  TOKEN_URL = "#{Rails.application.credentials.alarmbox[:api_base_url]}/oauth/token"

  # GET /auth/alarmbox
  # アラームボックスの認証URLにリダイレクト
  def authorize
    params = {
      client_id: Rails.application.credentials.alarmbox[:client_id],
      redirect_uri: Rails.application.credentials.alarmbox[:callback_uri],
      response_type: "code",
      scope: "read guarantee_exam:create guarantee_exam:stop guarantee:create guarantee:fulfillment"
    }
    redirect_to "#{AUTHORIZE_URL}?#{params.to_query}", allow_other_host: true
  end

  # POST /auth/alarmbox/callback
  # OOBフロー: フロントエンドから認可コードを受け取ってアクセストークンを返す
  def callback
    code = params.require(:code)

    response = fetch_token(code)
    token_data = JSON.parse(response.body)

    if response.is_a?(Net::HTTPSuccess)
      render json: {
        access_token: token_data["access_token"],
        refresh_token: token_data["refresh_token"],
        expires_in: token_data["expires_in"]
      }
    else
      render json: { error: token_data["error_description"] || "Token取得に失敗しました" }, status: :bad_gateway
    end
  end

  private

  def fetch_token(code)
    uri = URI.parse(TOKEN_URL)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.path)
    request.set_form_data(
      grant_type: "authorization_code",
      client_id: Rails.application.credentials.alarmbox[:client_id],
      client_secret: Rails.application.credentials.alarmbox[:client_secret],
      code: code,
      redirect_uri: Rails.application.credentials.alarmbox[:callback_uri]
    )
    http.request(request)
  end
end
