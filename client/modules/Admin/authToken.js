export function getToken() {
  // No localStorage, probably on server-side
  if (typeof localStorage === 'undefined') { return null; }
  return localStorage.token;
}

export function setToken(token) {
  if (typeof localStorage === 'undefined') { return; }
  localStorage.token = token;
}
