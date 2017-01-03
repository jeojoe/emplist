import Users from '../models/Users';
import jwt from 'jsonwebtoken';
import config from '../../secret_config.json';

export function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(403).end();
  } else {
    Users.findOne({ username }, (err, user) => {
      if (err) res.status(500).send(err);

      if (!user || password !== user.password) {
        res.json({
          ok: false,
          msg: 'what? calm down mannn.',
        });
      } else {

        // auth token
        const token = jwt.sign({ username }, config.jwtSecret, {
          expiresIn: (1 * 60 * 60), // 1 hour
        });
        res.json({
          ok: true,
          msg: 'logged in yo',
          token,
        });
      }
    });
  }
}
