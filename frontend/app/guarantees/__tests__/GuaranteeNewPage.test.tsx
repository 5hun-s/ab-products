import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GuaranteeNewPage from "../new/page";

global.fetch = jest.fn();

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("GuaranteeNewPage", () => {
  beforeEach(() => {
    localStorage.clear();
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
    window.history.pushState({}, "", "/guarantees/new");
  });

  it("全フォームフィールドが表示される", () => {
    render(<GuaranteeNewPage />);
    expect(screen.getByLabelText("保証審査ID")).toBeInTheDocument();
    expect(screen.getByLabelText("希望保証額")).toBeInTheDocument();
    expect(screen.getByLabelText("保証開始日")).toBeInTheDocument();
    expect(screen.getByLabelText("保証終了日")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保証依頼を送信" })).toBeInTheDocument();
  });

  it("URLのexam_idクエリパラメータでexam_idが初期入力される", () => {
    window.history.pushState({}, "", "/guarantees/new?exam_id=12345");
    render(<GuaranteeNewPage />);
    expect(screen.getByLabelText("保証審査ID")).toHaveValue(12345);
  });

  it("未認証の場合はエラーメッセージを表示しfetchを呼ばない", async () => {
    render(<GuaranteeNewPage />);
    await userEvent.type(screen.getByLabelText("保証審査ID"), "12345");
    await userEvent.type(screen.getByLabelText("希望保証額"), "1000000");
    await userEvent.type(screen.getByLabelText("保証開始日"), "2023-03-27");
    await userEvent.type(screen.getByLabelText("保証終了日"), "2023-04-27");
    await userEvent.click(screen.getByRole("button", { name: "保証依頼を送信" }));

    await waitFor(() => {
      expect(screen.getByText(/認証が必要です/)).toBeInTheDocument();
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("フォーム送信成功後に保証一覧画面へ遷移する", async () => {
    localStorage.setItem("alarmbox_access_token", "test-token");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ guarantee_id: 1 }),
    });

    render(<GuaranteeNewPage />);
    await userEvent.type(screen.getByLabelText("保証審査ID"), "12345");
    await userEvent.type(screen.getByLabelText("希望保証額"), "1000000");
    await userEvent.type(screen.getByLabelText("保証開始日"), "2023-03-27");
    await userEvent.type(screen.getByLabelText("保証終了日"), "2023-04-27");
    await userEvent.click(screen.getByRole("button", { name: "保証依頼を送信" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/guarantees");
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      })
    );
  });

  it("APIがエラーを返した場合はエラーメッセージを表示する", async () => {
    localStorage.setItem("alarmbox_access_token", "test-token");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "入力内容に誤りがあります" }),
    });

    render(<GuaranteeNewPage />);
    await userEvent.type(screen.getByLabelText("保証審査ID"), "12345");
    await userEvent.type(screen.getByLabelText("希望保証額"), "1000000");
    await userEvent.type(screen.getByLabelText("保証開始日"), "2023-03-27");
    await userEvent.type(screen.getByLabelText("保証終了日"), "2023-04-27");
    await userEvent.click(screen.getByRole("button", { name: "保証依頼を送信" }));

    await waitFor(() => {
      expect(screen.getByText("入力内容に誤りがあります")).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("通信エラー時にエラーメッセージを表示する", async () => {
    localStorage.setItem("alarmbox_access_token", "test-token");
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(<GuaranteeNewPage />);
    await userEvent.type(screen.getByLabelText("保証審査ID"), "12345");
    await userEvent.type(screen.getByLabelText("希望保証額"), "1000000");
    await userEvent.type(screen.getByLabelText("保証開始日"), "2023-03-27");
    await userEvent.type(screen.getByLabelText("保証終了日"), "2023-04-27");
    await userEvent.click(screen.getByRole("button", { name: "保証依頼を送信" }));

    await waitFor(() => {
      expect(screen.getByText("通信エラーが発生しました")).toBeInTheDocument();
    });
  });

  it("戻るボタンクリックで保証一覧画面へ遷移する", async () => {
    render(<GuaranteeNewPage />);
    await userEvent.click(screen.getByRole("button", { name: "← 保証一覧に戻る" }));
    expect(mockPush).toHaveBeenCalledWith("/guarantees");
  });
});
