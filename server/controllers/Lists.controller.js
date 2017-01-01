import Lists from '../models/Lists';
// import Companies from '../models/Companies';
// import cuid from 'cuid';
// import slug from 'limax';
import sanitizeHtml from 'sanitize-html';
import mongoose from 'mongoose';

/**
 * Get all posts (pagination)
 * @param req
 * @param res
 * @returns void
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
