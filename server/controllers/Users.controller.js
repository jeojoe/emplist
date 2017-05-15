import Users from '../models/Users';
import jwt from 'jsonwebtoken';
import { signToken } from '../util/jwt-helpers';
import config from '../../secret_config.json';

export function validateEditingToken(req, res) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        /*
          To resign token !!
        */
        res.json({ ok: false, msg: 'Failed to authenticate' });
        return;
      }
      if (decoded.sub !== req.params.list_id) {
        res.json({ ok: false, msg: 'Wrong token.' });
        return;
      }
      res.json({ ok: true });
    });
  } else {
    res.json({
      ok: false,
      msg: 'No token provided (in validate token api)',
    });
  }
}

export function validateAdminToken(req, res) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.jwtSecret, (err) => {
      if (err) {
        /*
          To resign token !!
        */
        res.json({ ok: false, msg: 'Failed to authenticate' });
        return;
      }
      // if (decoded.sub !== req.params.list_id) {
      //   res.json({ ok: false, msg: 'Wrong token.' });
      //   return;
      // }
      res.json({ ok: true });
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
  console.log(username)
  console.log("//")
  console.log(password)
  console.log("================")
  if (!username || !password) {
    res.status(403).end();
  } else {
    Users.findOne({ _id: '59191b1007c794f2fca2e9da' }).exec((err, user) => {
      console.log(user);
      console.log("^^ FUCKKKK")
    });
    Users.findOne({ username }, (err, user) => {
      console.log(err);
      console.log("^^^ err");
      if (err) {
        res.status(500).send({
          msg: err,
        });
      }
      console.log(user);
      console.log("^^^ user");
      console.log(password);
      console.log("^^^ password");
      // console.log(user.password);
      // console.log("^^^ user.password");
      // if (!user || password !== user.password) {
      if (user) {
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
