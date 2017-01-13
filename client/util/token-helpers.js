import cookie from 'react-cookie';

// Use cookies to store JWT token
export function getToken() {
  return cookie.load('token');
}

export function setToken(token) {
  cookie.save('token', token);
}
