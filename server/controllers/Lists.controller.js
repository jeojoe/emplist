import Lists from '../models/Lists';
// import Companies from '../models/Companies';
// import cuid from 'cuid';
// import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

/**
 * Get all posts
 * @param req
 * @param res
 * @returns void
 */
export function getAllLists(req, res) {
  Lists.find().sort('-created_at').exec((err, lists) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ lists });
  });
}

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
 * Save a post
 * @param req
 * @param res
 * @returns void
 */
export function insertList(req, res) {
  if (!req.body.list.company_name || !req.body.list.title || !req.body.list.details) {
    res.status(403).end();
  }

  const newList = new Lists(req.body.post);

  // Let's sanitize inputs
  newList.title = sanitizeHtml(newList.title);
  newList.company_name = sanitizeHtml(newList.company_name);
  newList.details = sanitizeHtml(newList.details);

  // newList.slug = slug(newList.title.toLowerCase(), { lowercase: true });
  // newList.cuid = cuid();

  newList.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ list: saved });
  });
}

/**
 * Get a single post
 * @param req
 * @param res
 * @returns void
 */
// export function getPost(req, res) {
//   Lists.findOne({ _id: req.params.listId }).exec((err, list) => {
//     if (err) {
//       res.status(500).send(err);
//     }
//     res.json({ list });
//   });
// }

/**
 * Delete a post
 * @param req
 * @param res
 * @returns void
 */
// export function deletePost(req, res) {
//   Post.findOne({ cuid: req.params.cuid }).exec((err, post) => {
//     if (err) {
//       res.status(500).send(err);
//     }

//     post.remove(() => {
//       res.status(200).end();
//     });
//   });
// }
