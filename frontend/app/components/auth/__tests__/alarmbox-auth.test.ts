import { Step, isAuthenticated } from "../alarmbox-auth";

describe("Step enum", () => {
  it("正しい値を持つ", () => {
    expect(Step.Idle).toBe("idle");
    expect(Step.Waiting).toBe("waiting");
    expect(Step.Loading).toBe("loading");
    expect(Step.Success).toBe("success");
  });
});

describe("isAuthenticated", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("トークンがない場合はfalseを返す", () => {
    expect(isAuthenticated()).toBe(false);
  });

  it("トークンがあり有効期限内の場合はtrueを返す", () => {
    localStorage.setItem("alarmbox_access_token", "test-token");
    localStorage.setItem("alarmbox_expires_at", String(Date.now() + 10000));
    expect(isAuthenticated()).toBe(true);
  });

  it("トークンの有効期限が切れている場合はfalseを返す", () => {
    localStorage.setItem("alarmbox_access_token", "test-token");
    localStorage.setItem("alarmbox_expires_at", String(Date.now() - 1000));
    expect(isAuthenticated()).toBe(false);
  });
});
