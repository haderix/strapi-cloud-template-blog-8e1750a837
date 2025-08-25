'use strict';

module.exports = ({ strapi }) => ({
  async sync(ctx) {
    try {
      const appfolioService = strapi.plugin('appfolio-sync').service('appfolio');
      const result = await appfolioService.syncUnits();
      
      ctx.body = {
        message: `Successfully synced ${result.count} units from AppFolio`,
        count: result.count,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      strapi.log.error('AppFolio sync failed:', err);
      ctx.status = 500;
      ctx.body = { 
        error: 'Sync failed',
        message: err.message,
        timestamp: new Date().toISOString()
      };
    }
  },
});
