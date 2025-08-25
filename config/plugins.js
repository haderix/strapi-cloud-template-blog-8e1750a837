module.exports = () => ({
  'appfolio-sync': {
    enabled: true,
    resolve: './src/plugins/appfolio-sync'
  },
  cron: {
    enabled: false, // Temporarily disable cron plugin
  },
});
