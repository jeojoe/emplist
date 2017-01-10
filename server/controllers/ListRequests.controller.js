import sanitizeHtml from 'sanitize-html';
import ListRequests from '../models/ListRequests';
import Lists from '../models/Lists';
import Companies from '../models/Companies';
import { tempPassword } from '../../secret_config.json';
import bcrypt from 'bcrypt';


function bcryptPassword(password) {
  return bcrypt.genSalt(10).then((result) => {
    return bcrypt.hash(password, result);
  });
}

/**
 * Get list request
 * @param req
 * @param res
 * @returns void
 */
export function getAllListRequests(req, res) {
  ListRequests.find({ is_approved: false })
    .sort('-created_at')
    .select('_id request_type company_name title salary exp skills allow_remote company_image ')
    .exec((err, requests) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({
          ok: true,
          msg: 'done',
          requests,
        });
      }
    });
}

/**
 * Get list request
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
 * Insert list request
 * @param req
 * @param res
 * @returns void
 */
export function insertListRequest(req, res) {
  const { title, tags, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, how_to_apply, company_name, company_image, remote_check, email, password, additional_note, details, country, city, location_detail } = req.body.list_request;

  if (!title || !tags || !company_name || !country || !city || !location_detail || !email || !password) {
    res.status(403).end();
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
      res.json({ list_request_id: list_request._id });
    })
    .catch(err => {
      // 3.2 Error
      console.log(`error inserting post`,err);
      res.status(500).send(err);
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
        res.status(404).send(err);
      }
      if (!result) {
        res.json({ exist: false });
      } else {
        res.json({
          exist: true,
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
      msg: 'whoa calm down mann. can\'t we be cool?',
    });
  } else {
    ListRequests.findOne(
      { _id: list_request_id },
      (err, list_request) => {
        if (err) {
          res.json({
            ok: false,
            msg: 'Error : finding list request',
            err,
          });
        }
        if (!list_request) {
          res.json({
            ok: false,
            msg: 'Not found',
          });
        } else {
          // Annoying js delete bug made me do this..
          const {
            company_id, company_image, company_email, company_name, company_location, password: listPassword, allow_remote, skills, title, exp, salary, details, how_to_apply,
          } = list_request;
          const saveList = new Lists({
            company_id, company_image, company_email, company_name, company_location, password: listPassword, allow_remote, skills, title, exp, salary, details, how_to_apply,
          });
          saveList.save((err1, saved) => {
            if (err1) {
              res.json({
                ok: false,
                msg: err1,
              });
            } else {
              res.json({
                ok: true,
                msg: 'Done approve request !',
                data: { list_id: saved._id },
              });
              ListRequests.update(
                { _id: list_request_id },
                {
                  $set: {
                    is_approved: true,
                    list_id: saved._id,
                  },
                }
              );
            }
          });
        }
      }
    );
  }
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
      msg: 'whoa calm down mann. can\'t we be cool?',
    });
  } else {
    ListRequests.findOne(
      { _id: list_request_id },
      (err, list_request) => {
        if (err) {
          res.json({
            ok: false,
            msg: 'Internal Error',
            err,
          });
        }
        if (!list_request) {
          res.json({
            ok: false,
            msg: 'Not found',
          });
        } else {
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
        }
      }
    );
  }
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
      res.json({ done: false, err });
    }
    res.json({ done: true });
  });
}
