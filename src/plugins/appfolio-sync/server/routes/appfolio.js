'use strict';

module.exports = [
  {
    method: "POST",
    path: "/sync",
    handler: "appfolio.sync",
    config: {
      auth: false, // or true if you want to lock it down
    },
  },
];
