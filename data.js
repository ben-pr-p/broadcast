var log = require('debug')('broadcast:data');

/**
 * Load non-sensitive data
 */

var teams = require('./teams.json');

/**
 * Load sensitive data from environment variables
 */

teams.forEach(function (t) {

  // get the teams outgoing payload token
  if (t.incoming) {
    t.IN_TOKEN = process.env[`${t.team_domain}_token`];

    if (!t.IN_TOKEN) {
      log(`Missing env var ${t.team_domain}_token – exiting...`);
      process.exit();
    }
  }

  // get the teams incoming POST url
  if (t.outgoing) {
    t.OUT_URL = process.env[`${t.team_domain}_url`];

    if (!t.OUT_URL) {
      log(`Missing env var ${t.team_domain}_url – exiting...`);
      process.exit();
    }
  }
});

module.exports = teams;
