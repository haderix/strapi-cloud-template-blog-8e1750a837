'use strict';

module.exports = ({ strapi }) => ({
  async sync(ctx) {
    const count = await strapi
      .plugin("appfolio-sync")
      .service("appfolio")
      .syncUnits();

    ctx.send({ message: `Synced ${count} units from AppFolio.` });
  },
});
