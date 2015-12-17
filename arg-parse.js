var db = require('./db-api');
var log = require('debug')('broadcast:arg-parse');

function indexOfMarker(tokens, marker) {
  log(tokens);
  log(marker);
  var possibilities = [
    tokens.indexOf(`—${marker}`), 
    tokens.indexOf(`-${marker}`), 
    tokens.indexOf(`--${marker}`),
    tokens.indexOf(`––${marker}`)
  ];
  log(possibilities);
  var result = -1;
  possibilities.forEach(idx => {
    result = idx;
  });
  return result;
}

function plusOneOf(text, marker) {
  var tokens = text.split(' ');

  var markerIdx = indexOfMarker(tokens, marker);
  if (markerIdx > -1) {
    return tokens[markerIdx + 1];
  }

  return null;
}

exports.bannedUser = function (text) {
  return plusOneOf(text, 'ban');
}

exports.unbannedUser = function (text) {
  return plusOneOf(text, 'unban');
}

exports.adminUser = function (text) {
  return plusOneOf(text, 'admin');
}

exports.deadminUser = function (text) {
  return plusOneOf(text, 'deadmin');
}

exports.offTeam = function (text) {
  return plusOneOf(text, 'turnoff');
}

exports.onTeam = function (text) {
  return plusOneOf(text, 'turnon');
}

exports.addingTeam = function (text) {
  return plusOneOf(text, 'addteam');
}

exports.teamListRequested = function (text) {
  var tokens = text.split(' ');

  var teamsIdx = indexOfMarker(tokens, 'teams');
  if (teamsIdx > -1) {
    if (tokens.length < 3) return true;
    if (tokens[teamsIdx + 1][0] != '[') return true;
  }

  return null;
}

exports.teamList = function (askingTeamDomain, fn) {
  db.allTeams(function (err, teams) {
    if (err) return fn(err);

    var askingTeam = teams.filter(t => t.domain == askingTeamDomain)[0];

    var teamsDisplay = '';
    teams.forEach(t => {
      teamsDisplay += `• ${t.domain} -->> ${t.display}`;

      if (askingTeam.accepts.indexOf(t.id) < 0) {
        teamsDisplay += ' (muted)';
      }

      teamsDisplay += '\n';
    });

    return fn(null, `${'```'}${teamsDisplay}${'```'}`);
  });
}

exports.parseTargetTeams = function (text) {
  var tokens = text.split(' ');

  var teamsIdx = indexOfMarker(tokens, 'teams');
  if (teamsIdx > -1) {
    var startIdx = text.indexOf('[');
    var endIdx = text.indexOf(']');

    var targetTeams = text.splice(startIdx, endIdx - startIdx).split(',');
    targetTeams.forEach(t => {
      t.replace(/ /g,'');
    });
    return targetTeams;
  }

  return false;
}

exports.helpRequested = function (text) {
  var tokens = text.split(' ');
  if (tokens.length == 1) return true;
  if (indexOfMarker(tokens, 'help') > -1) return true;
  return false;
}

exports.helpMessage = function (fn) {
  db.allTeams(function (err, teams) {
    if (err) return fn(err);

    var teamsDisplay = '';
    teams.forEach(t => {
      teamsDisplay += `• ${t.domain} -->> ${t.display}\n`;
    });

    return fn(null, `Welcome to broadcast! A Slack bot that sends messages across Slack teams.
*Broadcast a message* with:
${'```'}broadcast: <your message here>${'```'}

*Target your message to specific teams* by using \`--teams\`:
${'```'}broadcast: --teams [domain name 1, domain name 2, ...] <your message here>${'```'}
_Note – anything in between [ and ] will be interpreted as a team domain_

To *quiet a team*, type:
${'```'}broadcast: —turnoff <team domain>${'```'}

To *"unquiet" a team*, type:
${'```'}broadcast: --turnon <team domain>${'```'}

To see this *help message*, type:
${'```'}broadcast: help${'```'}

To see the *list of connected teams*, type:
${'```'}broadcast: --teams${'```'} with nothing after.

You currently have ${teams.length} teams connected to your broadcast:
${'```'}
${teamsDisplay}
${'```'}
Contact ben.paul.ryan.packer@gmail.com with questions`);
  });
}

