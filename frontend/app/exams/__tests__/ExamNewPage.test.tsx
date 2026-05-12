import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExamNewPage from "../new/page";

global.fetch = jest.fn();

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("ExamNewPage", () => {
  beforeEach(() => {
    localStorage.clear();
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it("全フォームフィールドが表示される", () => {
    render(<ExamNewPage />);
    expect(screen.getByLabelText("企業名")).toBeInTheDocument();
    expect(screen.getByLabelText("代表者名")).toBeInTheDocument();
    expect(screen.getByLabelText("住所")).toBeInTheDocument();
    expect(screen.getByLabelText("法人番号")).toBeInTheDocument();
    expect(screen.getByLabelText("希望保証額")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "審査依頼を送信" })).toBeInTheDocument();
  });

  it("未認証の場合はエラーメッセージを表示しfetchを呼ばない", async () => {
    render(<ExamNewPage />);
    await userEvent.type(screen.getByLabelText("企業名"), "テスト会社");
    await userEvent.type(screen.getByLabelText("代表者名"), "田中太郎");
    await userEvent.type(screen.getByLabelText("住所"), "東京都");
    await userEvent.type(screen.getByLabelText("法人番号"), "1234567890123");
    await userEvent.type(screen.getByLabelText("希望保証額"), "100000");
    await userEvent.click(screen.getByRole("button", { name: "審査依頼を送信" }));

    await waitFor(() => {
      expect(screen.getByText(/認証が必要です/)).toBeInTheDocument();
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("フォーム送信成功後に審査一覧画面へ遷移する", async () => {
    localStorage.setItem("alarmbox_access_token", "test-token");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ exam_id: 1 }),
    });

    render(<ExamNewPage />);
    await userEvent.type(screen.getByLabelText("企業名"), "テスト会社");
    await userEvent.type(screen.getByLabelText("代表者名"), "田中太郎");
    await userEvent.type(screen.getByLabelText("住所"), "東京都渋谷区");
    await userEvent.type(screen.getByLabelText("法人番号"), "1234567890123");
    await userEvent.type(screen.getByLabelText("希望保証額"), "500000");
    await userEvent.click(screen.getByRole("button", { name: "審査依頼を送信" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/exams");
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

    render(<ExamNewPage />);
    await userEvent.type(screen.getByLabelText("企業名"), "エラー会社");
    await userEvent.type(screen.getByLabelText("代表者名"), "エラー太郎");
    await userEvent.type(screen.getByLabelText("住所"), "大阪府");
    await userEvent.type(screen.getByLabelText("法人番号"), "9999999999999");
    await userEvent.type(screen.getByLabelText("希望保証額"), "1000");
    await userEvent.click(screen.getByRole("button", { name: "審査依頼を送信" }));

    await waitFor(() => {
      expect(screen.getByText("入力内容に誤りがあります")).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("通信エラー時にエラーメッセージを表示する", async () => {
    localStorage.setItem("alarmbox_access_token", "test-token");
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(<ExamNewPage />);
    await userEvent.type(screen.getByLabelText("企業名"), "テスト");
    await userEvent.type(screen.getByLabelText("代表者名"), "テスト");
    await userEvent.type(screen.getByLabelText("住所"), "テスト");
    await userEvent.type(screen.getByLabelText("法人番号"), "1111111111111");
    await userEvent.type(screen.getByLabelText("希望保証額"), "100");
    await userEvent.click(screen.getByRole("button", { name: "審査依頼を送信" }));

    await waitFor(() => {
      expect(screen.getByText("通信エラーが発生しました")).toBeInTheDocument();
    });
  });

  it("戻るボタンクリックで審査一覧画面へ遷移する", async () => {
    render(<ExamNewPage />);
    await userEvent.click(screen.getByRole("button", { name: "← 審査一覧に戻る" }));
    expect(mockPush).toHaveBeenCalledWith("/exams");
  });
});
