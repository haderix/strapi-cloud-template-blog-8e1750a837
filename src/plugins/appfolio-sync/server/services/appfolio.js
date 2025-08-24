'use strict';

const axios = require("axios");
const csv = require("csvtojson");

module.exports = ({ strapi }) => ({
  async fetchUnits() {
    const url = process.env.APPFOLIO_REPORT_URL; // full URL to Unit Directory report .csv
    const username = process.env.APPFOLIO_USER;
    const password = process.env.APPFOLIO_PASS;

    const response = await axios.get(url, {
      auth: { username, password },
      responseType: "text",
    });

    const units = await csv().fromString(response.data);
    return units;
  },

  async syncUnits() {
    const units = await this.fetchUnits();

    for (const unit of units) {
      await strapi.db.query("api::rental-unit.rental-unit").upsert({
        where: { unit_id: unit["Unit ID"] }, // assumes "Unit ID" is a column in AppFolio report
        update: {
          name: unit["Unit Name"],
          address: unit["Property Address"],
          rent: unit["Market Rent"],
          status: unit["Status"],
        },
        create: {
          unit_id: unit["Unit ID"],
          name: unit["Unit Name"],
          address: unit["Property Address"],
          rent: unit["Market Rent"],
          status: unit["Status"],
        },
      });
    }

    strapi.log.info(`[AppFolio] Synced ${units.length} units`);
    return units.length;
  },
});
