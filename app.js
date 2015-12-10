var express = require('express');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var broadcast = require('./broadcast');
var log = require('debug')('broadcast:app');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

var teams = require('./data');
var TOKENS = teams.filter(t => t.incoming).map(t => t.IN_TOKEN);

function helpRequested (text) {
  var parsed = text.split(' ');
  if (parsed.length == 1) return true;
  if (parsed[1] == 'help') return true;
  return false;
}

function helpMessage () {
  return `> Welcome to broadcast! A Slack bot for sending messages across Slack teams. To use broadcast, simply type:
   > \`broadcast: <your message here>\`

   > If you'd like to see this help message, type:
   > \`broadcast: help\` or \`broadcast:\` with nothing after.

   > You currently have ${teams.length} teams connected to your broadcast: they are:
   >  ${teams.map(t => t.team_display).join(', ')}`;
}

/**
 * Handle requests
 */

app.post('/', function (req, res) {
  log('Recieved message with data %j', req.body);

  if (TOKENS.indexOf(req.body.token) < 0) {
    log(`Request from ${req.body.team_domain} is forbidden.`);
    return res.json({
      text: `Sorry @${req.body.user_name}, ${req.body.team_domain} does not have posting permissions.`
    });
  }

  if (helpRequested(req.body.text)) {
    return res.json({
      text: `@${req.body.user_name}: ${helpMessage()}`
    });
  }

  broadcast(req.body, function (err, teams) {
    if (err) {
      log('Found error: %s', err);
      return res.json({
        text: `@${req.body.user_name}: unable to broadcast message – error: ${err}`
      });
    }

    log('Successfully sent message to teams %s', teams);
    res.json({
      text: `@${req.body.user_name}: your message has been broadcasted to teams ${teams.join(', ')}`
    });
  });
});

/*
 * Start the server
 */ 

var PORT = process.env.PORT;
if (!PORT) {
  log('Missing env var PORT, using 3000');
  PORT = 3000;
}

log('Listening on PORT %d', PORT);
app.listen(PORT);
