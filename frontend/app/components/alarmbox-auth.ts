export enum Step {
  Idle = "idle",
  Waiting = "waiting",
  Loading = "loading",
  Success = "success",
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem("alarmbox_access_token");
  if (!token) return false;
  const expiresAt = localStorage.getItem("alarmbox_expires_at");
  if (expiresAt && Date.now() > Number(expiresAt)) return false;
  return true;
}
