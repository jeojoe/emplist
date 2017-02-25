import ListRequests from '../models/ListRequests';
import Lists from '../models/Lists';
import Companies from '../models/Companies';
import { tempPassword } from '../../secret_config.json';
import bcrypt from 'bcrypt';
import _ from 'lodash';


function bcryptPassword(password) {
  return bcrypt.genSalt(10).then((result) => {
    return bcrypt.hash(password, result);
  });
}

/**
 * 1. Get all (unapproved) list requests
 * @param req
 * @param res
 * @returns void
 */
export function getAllListRequests(req, res) {
  const { request_type } = req.query;
  ListRequests.find({ is_approved: false, request_type })
    .sort('-created_at')
    .select('_id request_type company_name title salary exp skills allow_remote company_image ')
    .exec((err, requests) => {
      if (err) {
        res.json({
          ok: false, msg: err.message, err,
        });
      } else {
        res.json({
          ok: true, msg: 'done', requests,
        });
      }
    });
}

/**
 * 2. Get list request
 * @param req
 * @param res
 * @returns void
 */
export function getListRequest(req, res) {
  const { list_request_id } = req.params;
  ListRequests.findOne(
    { _id: list_request_id },
    (err, list_request) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({
          ok: true,
          msg: 'Done!',
          data: list_request,
        });
      }
    });
}

/**
 * 3. Insert list request
 * @param req
 * @param res
 * @returns void
 */
export function insertListRequest(req, res) {
  const { title, tags, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, how_to_apply, company_name, company_image, remote_check, email, password, additional_note, details, country, city, location_detail } = req.body.list_request;
  // console.log(!title || !tags || !company_name || !country || !city || !location_detail || !email || !password);
  if (!title || !tags || !company_name || !country || !city || !location_detail || !email || !password) {
    res.status(403).send({
      ok: false, msg: '31',
    });
  } else {
    // Hash password
    let HashedPassword = '';

    bcryptPassword(password)
    .then(hashedPassword => {
      // Store for the next promise
      HashedPassword = hashedPassword;
      // 1. Insert company
      return new Companies({
        company_image, company_name,
        company_email: email,
        company_location: { country, city, detail: location_detail },
        allow_remote: remote_check,
        password: hashedPassword,
      }).save();
    })
    .then((company) => {
      const company_id = company._id;
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
      const skills = tags.map((tag) => tag.text);

      // 2. Insert List Request
      return new ListRequests({
        request_type: 'new',
        company_id, company_image, company_name,
        company_email: email,
        company_location: { country, city, detail: location_detail },
        password: HashedPassword,
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
      }).save();
    })
    .then((list_request) => {
      // 3.1 Success
      res.json({ ok: true, list_request_id: list_request._id });
    })
    .catch(err => {
      // 3.2 Error
      console.log('error inserting post', err);
      res.status(500).send({
        ok: false, msg: '32',
      });
    });
  }
}

/**
 * Check list request
 * @param req
 * @param res
 * @returns void
 */
export function checkListRequest(req, res) {
  const { list_request_id } = req.params;
  ListRequests.findOne(
    { _id: list_request_id },
    (err, result) => {
      if (err) {
        res.status(404).send({
          ok: false, msg: 'Something went wrong.', err,
        });
      }
      if (!result) {
        res.json({ ok: false, msg: 'Not found' });
      } else {
        res.json({
          ok: true,
          company_name: result.company_name,
          title: result.title,
        });
      }
    }
  );
}

/**
 * Approve new List request
 */
export function approveNewListRequest(req, res) {
  const { list_request_id } = req.params;
  const { password } = req.body;
  if (password !== tempPassword) {
    res.json({
      ok: false,
      msg: 'who the fuck are you? get outta here...',
    });
    return;
  }
  ListRequests
    .findOne({ _id: list_request_id })
    .exec((err, list_request) => {
      if (err) {
        res.json({
          ok: false,
          msg: 'Error: finding list request',
          err,
        });
        return;
      }
      if (!list_request) {
        res.json({
          ok: false,
          msg: 'Not found',
          err,
        });
        return;
      }

      // do this first else we can't delete the properties...
      const cloned = list_request.toObject();
      // remove irrelevant fields
      delete cloned._id;
      delete cloned.request_type;
      delete cloned.is_approved;
      delete cloned.list_id;
      delete cloned.additional_note;
      delete cloned.request_promote;
      delete cloned.created_at;
      delete cloned.updated_at;
      delete cloned.__v;

      // make new list
      const newList = new Lists(cloned);

      newList.save((err1, saved_list) => {
        if (err1) {
          res.json({
            ok: false,
            msg: 'Saving new list',
            err1,
          });
          return;
        }

        ListRequests
          .where({ _id: list_request_id })
          .update({ is_approved: true, list_id: saved_list._id })
          .exec();

        res.json({
          ok: true,
          msg: 'Done approve request!',
          data: { list_id: saved_list._id },
        });
        return;
      });
    });
}

/**
 * Approve editing List request
 */
export function approveEditListRequest(req, res) {
  // get list request
  // update companies
  const { list_request_id } = req.params;
  const { password } = req.body;
  if (password !== tempPassword) {
    res.json({
      ok: false,
      msg: 'who the fuck are you? get outta here...',
    });
  }
  ListRequests
    .findOne({ _id: list_request_id })
    .exec((err, list_request) => {
      if (err) {
        res.json({
          ok: false,
          msg: 'Internal Error',
          err,
        });
        return;
      }
      if (!list_request) {
        res.json({
          ok: false,
          msg: 'Not found',
        });
        return;
      }
      const { list_id, company_name, title, details, how_to_apply, salary, exp, skills, allow_remote, company_location, company_image, company_id } = list_request;

      Companies.update(
        company_id,
        {
          $set: {
            company_image, company_name,
            allow_remote,
            'company_location.country': company_location.country,
            'company_location.city': company_location.city,
            'company_location.detail': company_location.detail,
            updated_at: new Date(),
          },
        },
        (err1) => {
          if (err1) {
            res.json({
              ok: false, msg: err1.message, err: err1,
            });
          } else {
            Lists.update(
              { _id: list_id },
              {
                $set: {
                  company_name, title, details, how_to_apply,
                  'salary.min': salary.min,
                  'salary.max': salary.max,
                  'exp.condition': exp.condition,
                  'exp.has_intern': exp.has_intern,
                  'exp.min': exp.min,
                  'exp.max': exp.max,
                  skills,
                  allow_remote: exp.allow_remote,
                  company_image,
                  'company_location.country': company_location.country,
                  'company_location.city': company_location.city,
                  'company_location.detail': company_location.detail,
                  updated_at: new Date(),
                },
              },
              (err2) => {
                if (err2) {
                  res.json({
                    ok: false, msg: err2.message, err: err2,
                  });
                } else {
                  res.json({
                    ok: true,
                    msg: 'Done approve request !',
                    data: { list_id },
                  });
                  ListRequests.update(
                    { _id: list_request_id },
                    {
                      $set: {
                        is_approved: true,
                        list_id,
                      },
                    }
                  ).exec();
                }
              }
            );
          }
        }
      );
    });
}

/**
 * Request promote
 */
export function requestPromote(req, res) {
  const { list_request_id } = req.params;
  ListRequests.update(
    { _id: list_request_id },
    { $set: { request_promote: true },
  }, (err) => {
    if (err) {
      res.json({ ok: false, msg: 'Something went wrong !', err });
    }
    res.json({ ok: true });
  });
}
