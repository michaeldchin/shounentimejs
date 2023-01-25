const express = require('express');

function createRouter(db) {
  const router = express.Router();

  router.get('/api/quotes', (req, res, next) => {
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

  router.get('/api/images', (req, res, next) => {
    const server = req.query.server
    const query = server !== 'undefined'
      ? 'SELECT * FROM images WHERE guildId = ' + server
      : 'SELECT * FROM images'
    db.query(
      query,
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