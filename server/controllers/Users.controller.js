import Users from '../models/Users';

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
        res.json({
          ok: true,
          msg: 'logged in yo',
        });
      }
    });
  }
}
