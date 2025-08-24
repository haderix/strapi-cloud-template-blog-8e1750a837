"use strict";

const axios = require("axios");

module.exports = {
  async syncUnits(strapi) {
    const appfolioUrl = process.env.APPFOLIO_UNIT_DIRECTORY_URL;
    const username = process.env.APPFOLIO_USERNAME;
    const password = process.env.APPFOLIO_PASSWORD;
    if (!appfolioUrl || !username || !password) {
      throw new Error("Missing AppFolio API credentials or URL");
    }
    // Fetch unit_directory.json
    const response = await axios.get(appfolioUrl, {
      auth: { username, password },
      responseType: "json",
    });
    const units = response.data.units || response.data; // adjust if structure differs
    // Map and upsert units into Strapi
    for (const unit of units) {
      // Example mapping: adjust to your content type fields
      const unitData = {
        name: unit.name || unit.unit_name,
        address: unit.address,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        rent: unit.rent,
        available: unit.available,
        appfolio_id: unit.id || unit.unit_id,
        // Add more fields as needed
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
      } else {
        await strapi.db.query("api::rental-unit.rental-unit").create({
          data: unitData,
        });
      }
    }
    return { count: units.length };
  },
};
// ...existing code...
