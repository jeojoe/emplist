import jwt from 'jsonwebtoken';
import config from '../config';
import secretConfig from '../../secret_config.json';
/*
  Sign jwt to user
*/
export function signToken(sub) {
  const claims = { sub };

  const token = jwt.sign(claims, secretConfig.jwtSecret, {
    expiresIn: config.tokenExpires,
  });

  return token;
}
