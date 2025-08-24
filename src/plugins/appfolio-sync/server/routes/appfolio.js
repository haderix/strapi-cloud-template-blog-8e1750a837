'use strict';

module.exports = [
  {
    method: 'POST',
    path: '/appfolio-sync/sync',
    handler: 'appfolio.sync',
    config: {
      policies: [],
      middlewares: [],
    },
  },
];
