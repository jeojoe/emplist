import Companies from '../models/Companies';

export function getCompanies(req, res) {
  Companies
    .find()
    .sort('-created_at')
    .exec((err, companies) => {
      if (err) {
        res.json({
          ok: false,
          msg: err.message,
          err,
        });
        return;
      }
      res.json({
        ok: true,
        msg: 'done',
        companies,
      });
    });
}
