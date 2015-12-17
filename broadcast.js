var request = require('request');
var db = require('./db-api');
var log = require('debug')('broadcast:broadcast');

function broadcastOne(postUrl, message, fn) {
  request({
    method: 'post',
    url: postUrl,
    body: {
      text: message
    },
    json: true
  }, function (err, response, body) {
    if (err) return fn(err);

    log('Successfully send post to %s', postUrl);
    return fn(null, body);
  });
}

function broadCastMany(message, teamsToSend, idx, fn) {
  if (idx == teamsToSend.length) {
    log('Finished broadcasting. Returning teams %j', teamsToSend);
    return fn(null, teamsToSend);
  }

  broadcastOne(teamsToSend[idx].outUrl, message, function (err, body) {
    if (err) return fn(err);

    broadCastMany(message, teamsToSend, idx + 1, fn);
  });
}

module.exports = function broadcast(data, targetTeams, fn) {
  db.teamsFor(data.team_domain, function (err, teams) {
    var originTeam = teams.filter(t => t.domain == data.team_domain)[0];

    var displayName = originTeam.display;

    var text;
    if (targetTeams) text = data.text.substr(data.text.indexOf(']'));
    else text = data.text.substr(10);

    var teamsToSend = teams;
    if (targetTeams) teamsToSend = teams.filter(t => targetTeams.indexOf(t.domain) > -1);

    var message = `${'```'}${data.user_name} from ${displayName} says:${'```'}\n${text}`;

    if (!originTeam.notifications) message = message.replace('@', '');

    broadCastMany(message, teamsToSend, 0, function (err, teamsSent) {
      if (err) {
        log('Found error: %s', err);
        return fn(err);
      }
      fn(null, teamsSent.map(t => t.team_display));
    });

  });
}