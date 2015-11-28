var request = require('request');
var teams = require('./data');
var log = require('debug')('broadcast:broadcast');

function broadcastOne(postUrl, message, fn) {
  request({
    method: 'POST',
    url: postUrl,
    form: {
      text: message
    }
  }, function (err, response, body) {
    if (err) return fn(err);

    return fn(null, body);
  });
}

function broadCastMany(message, teamsToSend, idx, fn) {
  if (idx == teamsToSend.length) {
    log('Finished broadcasting. Returning teams.');
    fn(null, teamsToSend);
  }

  broadcastOne(teamsToSend[idx].OUT_URL, message, function (err, body) {
    if (err) return fn(err);

    broadCastMany(message, teamsToSend, idx + 1, fn);
  });
}

module.exports = function broadcast(postUrl, data, fn) {
  var displayName = data.filter(t => t.team_domain == data.team_domain)[0].team_display;
  var text = data.text.substr(10);

  var message = `${data.user_name} from ${displayName} says:\n>${text}`;

  var teamsToSend = teams.filter(t => t.outgoing);

  broadCastMany(message, teamsToSend, 0, function (err, teamsSent) {
    if (err) {
      log('Found error: %s', err);
      return fn(err);
    }

    fn(null, teamsSent.map(t => t.displayName));
  });
}