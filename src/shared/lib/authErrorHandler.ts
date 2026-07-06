// Thin wrapper around window events so the axios interceptor
// can trigger auth redirects without importing React Router.

export function onAuthExpired() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('auth:expired'));
}

export function onAuthForbidden() {
  window.dispatchEvent(new Event('auth:forbidden'));
}
