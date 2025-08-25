'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/test-connection',
    handler: 'appfolio.testConnection',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/sync',
    handler: 'appfolio.sync',
    config: {
      policies: [],
      auth: false,
    },
  },
];
