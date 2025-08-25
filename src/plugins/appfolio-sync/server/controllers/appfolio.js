'use strict';

module.exports = ({ strapi }) => ({
  async testConnection(ctx) {
    try {
      const appfolioService = strapi.plugin('appfolio-sync').service('appfolio');
      const testResult = await appfolioService.testConnection();
      
      ctx.body = {
        success: true,
        message: 'AppFolio connection test completed',
        data: testResult,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      strapi.log.error('AppFolio connection test failed:', error);
      ctx.status = 500;
      ctx.body = { 
        success: false,
        message: 'AppFolio connection test failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

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
