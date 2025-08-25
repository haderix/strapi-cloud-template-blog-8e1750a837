"use strict";

const axios = require("axios").default;

module.exports = ({ strapi }) => ({
  async testConnection() {
    const appfolioUrl = process.env.APPFOLIO_UNIT_DIRECTORY_URL;
    const username = process.env.APPFOLIO_USERNAME;
    const password = process.env.APPFOLIO_PASSWORD;
    
    if (!appfolioUrl || !username || !password) {
      throw new Error("Missing AppFolio API credentials or URL in environment variables");
    }

    try {
      strapi.log.info('Testing AppFolio connection...');
      
      // Create axios instance with proper configuration
      const axiosConfig = {
        auth: { 
          username: username, 
          password: password 
        },
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Strapi-AppFolio-Sync/1.0'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 500; // Don't throw for 4xx errors
        }
      };

      const response = await axios.get(appfolioUrl, axiosConfig);

      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: ${response.statusText || 'Request failed'}`);
      }

      const units = response.data?.units || response.data;
      
      if (!units) {
        throw new Error("No data received from AppFolio API");
      }

      return {
        status: 'connected',
        apiUrl: appfolioUrl.replace(/\/[^\/]*:[^\/]*@/, '/***:***@'), // Hide credentials in response
        responseStatus: response.status,
        dataReceived: Array.isArray(units) ? units.length : typeof units === 'object' ? Object.keys(units).length : 1,
        dataType: Array.isArray(units) ? 'array' : typeof units,
        sampleData: Array.isArray(units) ? units.slice(0, 2) : (typeof units === 'object' ? Object.keys(units).slice(0, 5) : units)
      };
      
    } catch (error) {
      strapi.log.error('AppFolio API connection failed:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: appfolioUrl.replace(/\/[^\/]*:[^\/]*@/, '/***:***@')
      });

      // Provide more specific error messages
      if (error.code === 'ENOTFOUND') {
        throw new Error(`Cannot connect to AppFolio: Domain not found (${error.message})`);
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error('Connection to AppFolio timed out. Please check your network connection.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed: Invalid AppFolio credentials');
      } else if (error.response?.status === 403) {
        throw new Error('Access forbidden: Check your AppFolio permissions');
      } else if (error.response?.status === 404) {
        throw new Error('AppFolio endpoint not found: Check your APPFOLIO_UNIT_DIRECTORY_URL');
      } else {
        throw new Error(`Failed to connect to AppFolio: ${error.message}`);
      }
    }
  },

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
