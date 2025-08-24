'use strict';

module.exports = ({ strapi }) => {
  return {
    register() {},

    bootstrap() {
      // Register cron job for nightly sync
      strapi.cron.add({
        "0 2 * * *": async ({ strapi }) => {
          await strapi
            .plugin("appfolio-sync")
            .service("appfolio")
            .syncUnits();
        },
      });
    },
  };
};
