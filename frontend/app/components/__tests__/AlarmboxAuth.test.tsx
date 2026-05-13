import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AlarmboxAuth from "../AlarmboxAuth";

global.fetch = jest.fn();
const mockOpen = jest.fn();
window.open = mockOpen;

describe("AlarmboxAuth", () => {
  beforeEach(() => {
    localStorage.clear();
    (fetch as jest.Mock).mockClear();
    mockOpen.mockClear();
  });

  it("未認証時は連携ボタンを表示する", () => {
    render(<AlarmboxAuth />);
    expect(screen.getByRole("button", { name: "アラームボックスと連携する" })).toBeInTheDocument();
  });

  it("認証済みの場合は連携済み状態を表示する", () => {
    localStorage.setItem("alarmbox_access_token", "token");
    localStorage.setItem("alarmbox_expires_at", String(Date.now() + 10000));
    render(<AlarmboxAuth />);
    expect(screen.getByText("アラームボックスと連携済みです")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "連携を解除" })).toBeInTheDocument();
  });

  it("連携ボタンクリックで認証ウィンドウを開きコード入力欄を表示する", async () => {
    render(<AlarmboxAuth />);
    await userEvent.click(screen.getByRole("button", { name: "アラームボックスと連携する" }));
    expect(mockOpen).toHaveBeenCalledWith(expect.any(String), "_blank");
    expect(screen.getByPlaceholderText("認可コード")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "送信" })).toBeInTheDocument();
  });

  it("コードが空の場合は送信ボタンが無効化されている", async () => {
    render(<AlarmboxAuth />);
    await userEvent.click(screen.getByRole("button", { name: "アラームボックスと連携する" }));
    expect(screen.getByRole("button", { name: "送信" })).toBeDisabled();
  });

  it("コードを入力すると送信ボタンが有効化される", async () => {
    render(<AlarmboxAuth />);
    await userEvent.click(screen.getByRole("button", { name: "アラームボックスと連携する" }));
    await userEvent.type(screen.getByPlaceholderText("認可コード"), "auth-code-123");
    expect(screen.getByRole("button", { name: "送信" })).not.toBeDisabled();
  });

  it("認証成功後に連携済み状態を表示しトークンを保存する", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "new-token",
        refresh_token: "refresh",
        expires_in: 3600,
      }),
    });

    render(<AlarmboxAuth />);
    await userEvent.click(screen.getByRole("button", { name: "アラームボックスと連携する" }));
    await userEvent.type(screen.getByPlaceholderText("認可コード"), "valid-code");
    await userEvent.click(screen.getByRole("button", { name: "送信" }));

    await waitFor(() => {
      expect(screen.getByText("アラームボックスと連携済みです")).toBeInTheDocument();
    });
    expect(localStorage.getItem("alarmbox_access_token")).toBe("new-token");
    expect(localStorage.getItem("alarmbox_refresh_token")).toBe("refresh");
  });

  it("認証失敗時にAPIのエラーメッセージを表示する", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "コードが無効です" }),
    });

    render(<AlarmboxAuth />);
    await userEvent.click(screen.getByRole("button", { name: "アラームボックスと連携する" }));
    await userEvent.type(screen.getByPlaceholderText("認可コード"), "bad-code");
    await userEvent.click(screen.getByRole("button", { name: "送信" }));

    await waitFor(() => {
      expect(screen.getByText("コードが無効です")).toBeInTheDocument();
    });
  });

  it("通信エラー時にエラーメッセージを表示する", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(<AlarmboxAuth />);
    await userEvent.click(screen.getByRole("button", { name: "アラームボックスと連携する" }));
    await userEvent.type(screen.getByPlaceholderText("認可コード"), "some-code");
    await userEvent.click(screen.getByRole("button", { name: "送信" }));

    await waitFor(() => {
      expect(screen.getByText("通信エラーが発生しました")).toBeInTheDocument();
    });
  });

  it("連携解除ボタンクリックでトークンを削除し連携ボタンに戻る", async () => {
    localStorage.setItem("alarmbox_access_token", "token");
    localStorage.setItem("alarmbox_expires_at", String(Date.now() + 10000));
    render(<AlarmboxAuth />);

    await userEvent.click(screen.getByRole("button", { name: "連携を解除" }));

    expect(screen.getByRole("button", { name: "アラームボックスと連携する" })).toBeInTheDocument();
    expect(localStorage.getItem("alarmbox_access_token")).toBeNull();
  });

  it("認証成功後にalarmbox-auth-successイベントを発火する", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "token" }),
    });

    const handler = jest.fn();
    window.addEventListener("alarmbox-auth-success", handler);

    render(<AlarmboxAuth />);
    await userEvent.click(screen.getByRole("button", { name: "アラームボックスと連携する" }));
    await userEvent.type(screen.getByPlaceholderText("認可コード"), "code");
    await userEvent.click(screen.getByRole("button", { name: "送信" }));

    await waitFor(() => {
      expect(handler).toHaveBeenCalledTimes(1);
    });

    window.removeEventListener("alarmbox-auth-success", handler);
  });
});
