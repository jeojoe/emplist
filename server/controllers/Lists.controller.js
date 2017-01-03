import Lists from '../models/Lists';
import Companies from '../models/Companies';
// import Companies from '../models/Companies';
// import cuid from 'cuid';
// import slug from 'limax';

/**
 * Get all lists (pagination)
 */
export function getLists(req, res) {
  const startIndex = parseInt(req.query.startIndex, 10);
  const num = parseInt(req.query.num, 10);

  if (isNaN(startIndex) || isNaN(num)) {
    res.status(500).send('Invalid startIndex or Num');
    return;
  }

  Lists
    .find()
    .sort('-created_at')
    .skip(startIndex)
    .limit(num)
    .exec((err, lists) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json({ lists });
    });
}

/**
 * Get one list (pagination)
 */

export function getListDetail(req, res) {
  const list_id = req.params.id;
  Lists
    .findOne({ _id: list_id })
    .exec((err, list) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json({ list });
    });
}

/**
 * Edit one list
 */
export function updateList(req, res) {
  const { id, title, tags, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, how_to_apply, company_name, company_image, remote_check, details, country, city, location_detail, company_id } = req.body.list;

  if (!title || !tags || !company_name || !country || !city || !location_detail) {
    res.status(403).end();
  }

  Companies.update(
    { _id: company_id },
    {
      $set: {
        company_image, company_name,
        allow_remote: remote_check,
        'company_location.country': country,
        'company_location.city': city,
        'company_location.detail': location_detail,
        updated_at: Date.now,
      },
    },
    (err) => {
      if (err) res.status(500).send(err);
      else {
        let min = 0;
        let max = 0;
        if (exp_condition === 'between') {
          min = exp_between_min;
          max = exp_between_max;
        } else if (exp_condition === 'more_than') {
          min = exp_more_than;
          max = 99;
        } else {
          min = 0;
          max = 99;
        }

        const skills = tags.map((skill) => skill.text);
        Lists.update(
          { _id: id },
          {
            $set: {
              company_name, title, details, how_to_apply,
              'salary.min': salary_min || 0,
              'salary.max': salary_max || 9999999,
              'exp.condition': exp_condition,
              'exp.has_intern': intern_check,
              'exp.min': min,
              'exp.max': max,
              skills,
              allow_remote: remote_check,
              company_image,
              'company_location.country': country,
              'company_location.city': city,
              'company_location.detail': location_detail,
              updated_at: Date.now,
            },
          },
          (err1) => {
            if (err1) res.status(500).end(err);
            else {
              res.json({
                ok: true,
                msg: 'Done editing !',
              });
            }
          }
        );
      }
    }
  );
}

/**
 * Edit one list (pagination)
 */
export function updateeeList(req, res) {
  const { id, title, tags, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, how_to_apply, company_name, company_image, remote_check, details, country, city, location_detail, company_id } = req.body.list;

  if (!title || !tags || !company_name || !country || !city || !location_detail) {
    res.status(403).end();
  }

  Companies.update(
    { _id: company_id },
    {
      $set: {
        company_image, company_name,
        allow_remote: remote_check,
        'company_location.country': country,
        'company_location.city': city,
        'company_location.detail': location_detail,
        updated_at: Date.now,
      },
    },
    (err) => {
      if (err) res.status(500).send(err);
      else {
        let min = 0;
        let max = 0;
        if (exp_condition === 'between') {
          min = exp_between_min;
          max = exp_between_max;
        } else if (exp_condition === 'more_than') {
          min = exp_more_than;
          max = 99;
        } else {
          min = 0;
          max = 99;
        }

        const skills = tags.map((skill) => skill.text);
        Lists.update(
          { _id: id },
          {
            $set: {
              company_name, title, details, how_to_apply,
              'salary.min': salary_min || 0,
              'salary.max': salary_max || 9999999,
              'exp.condition': exp_condition,
              'exp.has_intern': intern_check,
              'exp.min': min,
              'exp.max': max,
              skills,
              allow_remote: remote_check,
              company_image,
              'company_location.country': country,
              'company_location.city': city,
              'company_location.detail': location_detail,
              updated_at: Date.now,
            },
          },
          (err1) => {
            if (err1) res.status(500).end(err);
            else {
              res.json({
                ok: true,
                msg: 'Done editing !',
              });
            }
          }
        );
      }
    }
  );
}
