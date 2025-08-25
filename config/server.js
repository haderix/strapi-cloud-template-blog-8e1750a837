module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  // Add required fields for cloud-cronjob-runner
  apiToken: env('API_TOKEN', 'changeme'),
  apiUrl: env('API_URL', 'http://localhost:1337'),
  firstRunWindow: env.int('FIRST_RUN_WINDOW', 10),
});
