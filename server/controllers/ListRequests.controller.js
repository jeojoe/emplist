import ListRequests from '../models/ListRequests';
import Companies from '../models/Companies';

/**
 * Get list request
 * @param req
 * @param res
 * @returns void
 */
// export function getListRequest(req, res) {
//   const { list_request_id } = req.params;
//   ListRequests.findOne(
//     { _id: list_request_id },
//     ''
//   );
// }

/**
 * Insert list request
 * @param req
 * @param res
 * @returns void
 */
export function insertListRequest(req, res) {
  const { title, tags, exp_condition, exp_between_min, exp_between_max, exp_more_than, intern_check, salary_min, salary_max, how_to_apply, company_name, company_image, remote_check, email, password, additional_note, details, country, city } = req.body.list_request;

  if (!title || !tags || !company_name || !country || !city || !email || !password) {
    res.status(403).end();
  }

  // Save company profile
  const newCompany = new Companies({
    company_image, company_name,
    company_email: email,
    company_location: { country, city },
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
        company_location: { country, city },
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
