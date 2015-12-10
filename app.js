var express = require('express');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var broadcast = require('./broadcast');
var log = require('debug')('broadcast:app');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

var teams = require('./data');
var TOKENS = teams.filter(t => t.incoming).map(t => t.IN_TOKEN);

var argParse = require('./arg-parse');

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

  if (argParse.helpRequested(req.body.text)) {
    return res.json({
      text: `@${req.body.user_name}: ${argParse.helpMessage()}`
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
