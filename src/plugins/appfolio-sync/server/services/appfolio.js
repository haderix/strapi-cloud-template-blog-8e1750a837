"use strict";

const axios = require("axios");

module.exports = ({ strapi }) => ({
  async syncUnits() {
    const appfolioUrl = process.env.APPFOLIO_UNIT_DIRECTORY_URL;
    const username = process.env.APPFOLIO_USERNAME;
    const password = process.env.APPFOLIO_PASSWORD;
    
    if (!appfolioUrl || !username || !password) {
      throw new Error("Missing AppFolio API credentials or URL in environment variables");
    }

    try {
      strapi.log.info('Starting AppFolio unit sync...');
      
      // Fetch unit_directory.json
      const response = await axios.get(appfolioUrl, {
        auth: { username, password },
        responseType: "json",
        timeout: 30000, // 30 second timeout
      });

      const units = response.data.units || response.data;
      
      if (!Array.isArray(units)) {
        throw new Error("Invalid response format: units should be an array");
      }

      let syncedCount = 0;
      let errorCount = 0;

      // Map and upsert units into Strapi
      for (const unit of units) {
        try {
          // Validate required fields
          if (!unit.id && !unit.unit_id) {
            strapi.log.warn('Skipping unit without ID:', unit);
            errorCount++;
            continue;
          }

          const unitData = {
            name: unit.name || unit.unit_name || 'Unnamed Unit',
            address: unit.address || '',
            bedrooms: parseInt(unit.bedrooms) || 0,
            bathrooms: parseFloat(unit.bathrooms) || 0,
            rent: parseFloat(unit.rent) || 0,
            available: Boolean(unit.available),
            appfolio_id: String(unit.id || unit.unit_id),
            description: unit.description || '',
            square_feet: parseInt(unit.square_feet) || null,
            last_synced: new Date(),
          };

          // Upsert logic: find by appfolio_id, update or create
          const existing = await strapi.db.query("api::rental-unit.rental-unit").findOne({
            where: { appfolio_id: unitData.appfolio_id },
          });

          if (existing) {
            await strapi.db.query("api::rental-unit.rental-unit").update({
              where: { id: existing.id },
              data: unitData,
            });
            strapi.log.debug(`Updated unit: ${unitData.appfolio_id}`);
          } else {
            await strapi.db.query("api::rental-unit.rental-unit").create({
              data: unitData,
            });
            strapi.log.debug(`Created unit: ${unitData.appfolio_id}`);
          }
          
          syncedCount++;
        } catch (unitError) {
          strapi.log.error(`Error processing unit ${unit.id || 'unknown'}:`, unitError);
          errorCount++;
        }
      }

      strapi.log.info(`AppFolio sync completed: ${syncedCount} synced, ${errorCount} errors`);
      
      return { 
        count: syncedCount, 
        errors: errorCount,
        total: units.length 
      };
    } catch (error) {
      strapi.log.error('AppFolio API request failed:', error);
      throw new Error(`Failed to fetch units from AppFolio: ${error.message}`);
    }
  },
});
