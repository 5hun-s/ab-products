import { render, screen, waitFor } from "@testing-library/react";
import GuaranteeList from "../GuaranteeList";

global.fetch = jest.fn();

describe("GuaranteeList", () => {
  beforeEach(() => {
    localStorage.clear();
    (fetch as jest.Mock).mockClear();
  });

  it("未認証の場合はエラーメッセージを表示しfetchを呼ばない", async () => {
    render(<GuaranteeList />);
    await waitFor(() => {
      expect(screen.getByText(/認証が必要です/)).toBeInTheDocument();
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("ローディング後に保証一覧を表示する", async () => {
    localStorage.setItem("alarmbox_access_token", "test-token");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        guarantees: [
          { guarantee_id: 1, company_name: "株式会社テスト", guarantee_amount: 100000, status: "active" },
          { guarantee_id: 2, company_name: "サンプル株式会社", guarantee_amount: 200000, status: "closed" },
        ],
      }),
    });

    render(<GuaranteeList />);
    expect(screen.getByText("読み込み中...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("株式会社テスト")).toBeInTheDocument();
    });
    expect(screen.getByText("サンプル株式会社")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("保証データがない場合は空メッセージを表示する", async () => {
    localStorage.setItem("alarmbox_access_token", "test-token");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ guarantees: [] }),
    });

    render(<GuaranteeList />);
    await waitFor(() => {
      expect(screen.getByText("保証データがありません。")).toBeInTheDocument();
    });
  });

  it("APIがエラーを返した場合はエラーメッセージを表示する", async () => {
    localStorage.setItem("alarmbox_access_token", "test-token");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "取得に失敗しました" }),
    });

    render(<GuaranteeList />);
    await waitFor(() => {
      expect(screen.getByText("取得に失敗しました")).toBeInTheDocument();
    });
  });

  it("通信エラーが発生した場合はエラーメッセージを表示する", async () => {
    localStorage.setItem("alarmbox_access_token", "test-token");
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(<GuaranteeList />);
    await waitFor(() => {
      expect(screen.getByText("通信エラーが発生しました")).toBeInTheDocument();
    });
  });

  it("AuthorizationヘッダーにBearerトークンを付与してfetchする", async () => {
    localStorage.setItem("alarmbox_access_token", "my-token");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ guarantees: [] }),
    });

    render(<GuaranteeList />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { Authorization: "Bearer my-token" },
        })
      );
    });
  });
});
