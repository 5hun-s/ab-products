require "rails_helper"

RSpec.describe "Guarantees", type: :request do
  let!(:access_token) { "test_access_token" }
  let!(:auth_header) { { "Authorization" => "Bearer #{access_token}" } }
  let!(:guarantee_response) do
    {
      guarantee_id: 54321,
      company_name: "アラームボックス株式会社",
      guarantee_amount: 1000000,
      status: "active"
    }
  end

  describe "GET /guarantees" do
    context "アクセストークンなしの場合" do
      it "401を返す" do
        get "/guarantees"
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)["error"]).to eq("アクセストークンが必要です")
      end
    end

    context "アクセストークンありの場合" do
      before do
        stub_request(:get, /guarantees/)
          .to_return(status: 200, body: { guarantees: [ guarantee_response ] }.to_json, headers: { "Content-Type" => "application/json" })
      end

      it "200を返す" do
        get "/guarantees", headers: auth_header
        expect(response).to have_http_status(:ok)

        data = JSON.parse(response.body)
        expect(data["guarantees"]).to be_an(Array)
        expect(data["guarantees"].first["company_name"]).to eq("アラームボックス株式会社")
      end
    end

    context "外部APIがエラーを返す場合" do
      before do
        stub_request(:get, /guarantees/)
          .to_return(status: 401, body: { error_description: "invalid_token" }.to_json, headers: { "Content-Type" => "application/json" })
      end

      it "502を返す" do
        get "/guarantees", headers: auth_header
        expect(response).to have_http_status(:bad_gateway)
        expect(JSON.parse(response.body)["error"]).to eq("invalid_token")
      end
    end
  end
end
