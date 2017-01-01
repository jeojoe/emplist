import ListRequests from '../models/ListRequests';
import Lists from '../models/Lists';
import Companies from '../models/Companies';
import { tempPassword } from '../../secret_config.json';

/**
 * Get list request
 * @param req
 * @param res
 * @returns void
 */
export function getAllListRequests(req, res) {
  ListRequests.find({})
    .sort('-created_at')
    .select('_id company_name title salary exp skills allow_remote company_image ')
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
  }

  // Save company profile
  const newCompany = new Companies({
    company_image, company_name,
    company_email: email,
    company_location: { country, city, detail: location_detail },
    allow_remote: remote_check,
    password,
  });

  let company_id = '';
  newCompany.save((err1, saved1) => {
    if (err1) {
      res.status(500).send(err1);
    } else {
      company_id = saved1._id;

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
        company_id, company_image, company_name,
        company_email: email,
        company_location: { country, city, detail: location_detail },
        password,
        allow_remote: remote_check,
        skills,
        title,
        exp: { condition: exp_condition, min, max, has_intern: intern_check },
        salary: {
          min: salary_min, max: salary_max,
        },
        details,
        how_to_apply,
        additional_note,
      });

      newListRequest.save((err2, saved2) => {
        if (err2) {
          res.status(500).send(err2);
        } else {
          res.json({ list_request_id: saved2._id });
        }
      });
    }
  });
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
 * Check list request
 * @param req
 * @param res
 * @returns void
 */
export function approveListRequest(req, res) {
  const { list_request_id } = req.params;
  const { password } = req.body;
  console.log(password, tempPassword);
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
          res.status(404).send(err);
        }
        if (!list_request) {
          res.json({
            ok: false,
            msg: 'Not found',
          });
        } else {
          console.log(list_request);
        }
      }
    );
  }
}

/**
 * Request promote
 * @param req
 * @param res
 * @returns void
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
