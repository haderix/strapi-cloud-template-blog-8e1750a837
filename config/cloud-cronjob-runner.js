// Temporarily disabled to test the AppFolio plugin functionality
// module.exports = ({ env }) => ({
//   apiToken: env('CLOUD_CRONJOB_RUNNER_API_TOKEN', 'your-default-token-here'),
//   apiUrl: env('CLOUD_CRONJOB_RUNNER_API_URL', 'https://your-api-url.example.com'),
//   firstRunWindow: env.int('CLOUD_CRONJOB_RUNNER_FIRST_RUN_WINDOW', 15), // default 15 minutes
// });

// Return empty config to prevent validation errors
module.exports = () => ({});
