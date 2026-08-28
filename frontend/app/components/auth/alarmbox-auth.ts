export enum Step {
  Idle = "idle",
  Waiting = "waiting",
  Loading = "loading",
  Success = "success",
}

export function getAccessToken(): string | null {
  return localStorage.getItem("alarmbox_access_token");
}

export function isAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  const expiresAt = localStorage.getItem("alarmbox_expires_at");
  if (Date.now() > Number(expiresAt)) return false;
  return true;
}
