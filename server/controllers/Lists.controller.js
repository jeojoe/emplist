import Lists from '../models/Lists';
import ListRequests from '../models/ListRequests';
import Companies from '../models/Companies';
import { signToken } from '../util/jwt-helpers';
import bcrypt from 'bcrypt';
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
export function sendEditListRequest(req, res) {
  const { _id, title, tags, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, how_to_apply, company_name, company_image, company_id, remote_check, additional_note, details, country, city, location_detail } = req.body.list;

  if (!title || !tags || !company_name || !country || !city || !location_detail) {
    res.json({ ok: false, msg: 'no required fields' });
  } else {
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

    const newListRequest = new ListRequests({
      list_id: _id,
      request_type: 'edit',
      company_image, company_name, company_id,
      company_location: { country, city, detail: location_detail },
      allow_remote: remote_check,
      skills,
      title,
      exp: { condition: exp_condition, min, max, has_intern: intern_check },
      salary: {
        min: salary_min || 0,
        max: salary_max || 9999999,
      },
      details,
      how_to_apply,
      additional_note,
    });

    newListRequest.save((err, saved) => {
      if (err) {
        res.json({ ok: false, msg: err.message });
      } else {
        res.json({ ok: true, list_request_id: saved._id });
      }
    });
  }
}

/*
  Check if user has permission on the List
*/
export function checkPermission(req, res) {
  const { password } = req.body;
  const list_id = req.params.id;

  if (!list_id) {
    res.json({ ok: false, msg: 'No list id' });
    return;
  }

  Lists.findOne({ _id: list_id }).select('password').exec((err, list) => {
    if (err) {
      res.json({ ok: false, msg: 'Error finding list' });
      return;
    }
    if (!list) {
      res.json({ ok: false, msg: 'Can\'t find list' });
      return;
    }
    bcrypt.compare(password, list.password, (err2, valid) => {
      if (err2) {
        // Internal error)
        res.json({
          ok: false, msg: 'Comparing hash failed.', err: err2,
        });
      } else if (!valid) {
        // Fail
        res.json({
          ok: false, msg: 'Authentication failed. Wrong password.',
        });
      } else {
        // Success -> create jwt then send it to client
        const token = signToken(list_id);
        res.json({
          ok: true, msg: 'logged in yo', token,
        });
      }
    });
  });
}
