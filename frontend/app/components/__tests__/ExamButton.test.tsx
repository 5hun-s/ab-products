import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExamButton from "../ExamButton";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("ExamButton", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
  });

  it("「審査一覧」ラベルのボタンが表示される", () => {
    render(<ExamButton />);
    expect(screen.getByRole("button", { name: "審査一覧" })).toBeInTheDocument();
  });

  it("未認証時はボタンが無効化されている", () => {
    render(<ExamButton />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("localStorageにトークンがある場合はボタンが有効化される", () => {
    localStorage.setItem("alarmbox_access_token", "test-token");
    render(<ExamButton />);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("認証済みの場合にクリックすると/examsに遷移する", async () => {
    localStorage.setItem("alarmbox_access_token", "test-token");
    render(<ExamButton />);
    await userEvent.click(screen.getByRole("button"));
    expect(mockPush).toHaveBeenCalledWith("/exams");
  });

  it("alarmbox-auth-successイベント後にボタンが有効化される", () => {
    render(<ExamButton />);
    expect(screen.getByRole("button")).toBeDisabled();

    act(() => {
      window.dispatchEvent(new Event("alarmbox-auth-success"));
    });

    expect(screen.getByRole("button")).not.toBeDisabled();
  });
});
