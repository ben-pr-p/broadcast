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

    log('Successfully send post to %s', postUrl);
    return fn(null, body);
  });
}

function broadCastMany(message, teamsToSend, idx, fn) {
  if (idx == teamsToSend.length) {
    log('Finished broadcasting. Returning teams %s', teamsToSend);
    fn(null, teamsToSend);
  }
  log(teamsToSend[idx]);
  broadcastOne(teamsToSend[idx].OUT_URL, message, function (err, body) {
    if (err) return fn(err);

    broadCastMany(message, teamsToSend, idx + 1, fn);
  });
}

module.exports = function broadcast(data, fn) {
  var displayName = teams.filter(t => t.team_domain == data.team_domain)[0].team_display;
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