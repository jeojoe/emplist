import Users from '../models/Users';
import jwt from 'jsonwebtoken';
import { signToken } from '../util/jwt-helpers';
import config from '../../secret_config.json';

export function validateToken(req, res) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log(token);
  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        /*
          To resign token !!
        */
        res.json({ ok: false, msg: 'Failed to authenticate' });
      } else {
        //  Check decoded
        if (decoded.sub !== req.params.id);
        res.json({ ok: true });
      }
    });
  } else {
    res.json({
      ok: false,
      msg: 'No token provided (in validate token api)',
    });
  }
}

export function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(403).end();
  } else {
    Users.findOne({ username }, (err, user) => {
      if (err) {
        res.status(500).send({
          msg: err,
        });
      }

      if (!user || password !== user.password) {
        res.json({
          ok: false,
          msg: 'what? calm down mannn.',
        });
      } else {
        // auth token
        const token = signToken(username);
        res.json({
          ok: true,
          msg: 'logged in yo',
          token,
        });
      }
    });
  }
}
