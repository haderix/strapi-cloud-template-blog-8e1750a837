'use strict';

module.exports = ({ strapi }) => {
  return {
    register() {
      // Plugin registration logic here if needed
    },

    bootstrap() {
      // Plugin bootstrap logic here
      // Note: Cron jobs should be set up in the main app bootstrap, not in plugin bootstrap
      strapi.log.info('AppFolio Sync plugin loaded successfully');
    },
  };
};
