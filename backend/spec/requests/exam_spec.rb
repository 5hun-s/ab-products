require "rails_helper"

RSpec.describe "Exams", type: :request do
  let!(:access_token) { "test_access_token" }
  let!(:auth_header) { { "Authorization" => "Bearer #{access_token}" } }
  let!(:exam_response) do
    {
      exam_id: 12345,
      exam_request_id: 987654,
      company_name: "アラームボックス株式会社",
      representative_name: "武田 浩和",
      address: "東京都新宿区市谷本村町3-22　ナカバビル8F",
      corporation_number: "1234678901234",
      guarantee_amount_hope: 1000000
    }
  end

  describe "GET /exams" do
    context "アクセストークンなしの場合" do
      it "401を返す" do
        get "/exams"
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)["error"]).to eq("アクセストークンが必要です")
      end
    end

    context "アクセストークンありの場合" do
      before do
        stub_request(:get, /exams/)
          .to_return(status: 200, body: [ exam_response ].to_json, headers: { "Content-Type" => "application/json" })
      end

      it "200を返す" do
        get "/exams", headers: auth_header
        expect(response).to have_http_status(:ok)

        # 審査一覧を返す
        data = JSON.parse(response.body)
        expect(data).to be_an(Array)
        expect(data.first["company_name"]).to eq("アラームボックス株式会社")
      end
    end

    context "外部APIがエラーを返す場合" do
      before do
        stub_request(:get, /exams/)
          .to_return(status: 401, body: { error_description: "invalid_token" }.to_json, headers: { "Content-Type" => "application/json" })
      end

      it "502を返す" do
        get "/exams", headers: auth_header
        expect(response).to have_http_status(:bad_gateway)
        # 外部APIのエラーメッセージを返す
        expect(JSON.parse(response.body)["error"]).to eq("invalid_token")
      end
    end
  end

  describe "POST /exams" do
    let!(:exam_params) do
      {
        exam: {
          company_name: "テスト株式会社",
          representative_name: "テスト太郎",
          address: "東京都渋谷区1-1-1",
          corporation_number: "1234567890123",
          guarantee_amount_hope: 1000000
        }
      }
    end

    context "アクセストークンなしの場合" do
      it "401を返す" do
        post "/exams", params: exam_params
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "アクセストークンありの場合" do
      before do
        stub_request(:post, /exams/)
          .to_return(status: 201, body: exam_response.to_json, headers: { "Content-Type" => "application/json" })
      end

      it "201を返す" do
        post "/exams", params: exam_params, headers: auth_header
        expect(response).to have_http_status(:created)
      end
    end

    context "外部APIがエラーを返す場合" do
      before do
        stub_request(:post, /exams/)
          .to_return(status: 422, body: { message: "バリデーションエラー" }.to_json, headers: { "Content-Type" => "application/json" })
      end

      it "502を返す" do
        post "/exams", params: exam_params, headers: auth_header
        expect(response).to have_http_status(:bad_gateway)
        # エラーメッセージを返す
        expect(JSON.parse(response.body)["error"]).to eq("バリデーションエラー")
      end
    end
  end
end
