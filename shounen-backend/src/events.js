const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  router.get('/quotes', (req, res, next) => {
    db.query(
      'SELECT * FROM quotes',
      [],
      (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(result);
        }
      },
    );
  });

  return router;
}

module.exports = createRouter;