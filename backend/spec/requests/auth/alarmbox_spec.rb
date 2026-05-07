require "rails_helper"

RSpec.describe "Auth::Alarmbox", type: :request do
  before do
      allow(Rails.application.credentials).to receive(:alarmbox).and_return(
        api_base_url: "https://example.com",
        client_id: "test_client_id",
        callback_uri: "https://callback.com",
      )
    end

  describe "GET /auth/alarmbox" do
    it "認証URLにリダイレクトする" do
      get "/auth/alarmbox"

      expect(response).to have_http_status(:found)
      expect(response.location).to include("/oauth/authorize")
      expect(response.location).to include("response_type=code")
      expect(response.location).to include("scope=")
    end
  end

  describe "POST /auth/alarmbox/callback" do
    context "有効な認可コードの場合" do
      before do
        stub_request(:post, /oauth\/token/)
          .to_return(
            status: 200,
            body: {
              access_token: "access_token_value",
              refresh_token: "refresh_token_value",
              expires_in: 7200
            }.to_json,
            headers: { "Content-Type" => "application/json" }
          )
      end

      it "200を返す" do
        post "/auth/alarmbox/callback", params: { code: "valid_code" }
        expect(response).to have_http_status(:ok)
        # アクセストークンを返す
        data = JSON.parse(response.body)
        expect(data["access_token"]).to eq("access_token_value")
        expect(data["refresh_token"]).to eq("refresh_token_value")
        expect(data["expires_in"]).to eq(7200)
      end
    end

    context "無効な認可コードの場合" do
      before do
        stub_request(:post, /oauth\/token/)
          .to_return(
            status: 400,
            body: { error_description: "invalid_grant" }.to_json,
            headers: { "Content-Type" => "application/json" }
          )
      end

      it "502を返す" do
        post "/auth/alarmbox/callback", params: { code: "invalid_code" }
        expect(response).to have_http_status(:bad_gateway)
        expect(JSON.parse(response.body)["error"]).to eq("invalid_grant")
      end
    end
  end
end
