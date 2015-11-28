var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var log = require('debug')('broadcast')

var app = express();
app.use(bodyParser.json());

var TEAM_TOKENS = process.env.TEAM_TOKENS;
if (!TEAM_TOKENS) {
  log('Missing env var TEAM_TOKENS – exiting...');
  process.exit();
}

TEAM_TOKENS = TEAM_TOKENS.split(',');
log('Starting with TEAM_TOKENS %s', TEAM_TOKENS);

app.post('/', function (req, res) {
  log('Recieved message with data %j', req.body);
  log(req);
  res.sendStatus(200);
});

/*
 * Get it started!
 */ 

var PORT = process.env.PORT;
if (!PORT) {
  log('Missing env var PORT, using 3000');
  PORT = 3000;
}

log('Listening on PORT %d', PORT);
app.listen(PORT);
