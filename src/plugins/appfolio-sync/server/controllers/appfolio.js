'use strict';

module.exports = ({ strapi }) => ({
  async sync(ctx) {
      try {
        const result = await appfolioService.syncUnits(strapi);
        ctx.body = {
          message: `Synced ${result.count} units from AppFolio`,
          count: result.count,
        };
      } catch (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
      }

    ctx.send({ message: `Synced ${count} units from AppFolio.` });
  const appfolioService = require("../services/appfolio");
  module.exports = {
    async sync(ctx) {
      try {
        const result = await appfolioService.syncUnits(strapi);
        ctx.body = {
          message: `Synced ${result.count} units from AppFolio`,
          count: result.count,
        };
      } catch (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
      }
    },
  };
  },
});
