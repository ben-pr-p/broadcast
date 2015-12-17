var db = require('./db-api');

function plusOneOf(text, marker) {
  var tokens = text.split(' ');

  var markerIdx = tokens.indexOf(marker);
  if (markerIdx > -1) {
    return tokens[markerIdx + 1];
  }

  return false;
}

exports.bannedUser = function (text) {
  return plusOneOf(text, '--ban');
}

exports.unbannedUser = function (text) {
  return plusOneOf(text, '--unban');
}

exports.adminUser = function (text) {
  return plusOneOf(text, '--admin');
}

exports.deadminUser = function (text) {
  return plusOneOf(text, '--deadmin');
}

exports.offTeam = function (text) {
  return plusOneOf(text, '--turnoff');
}

exports.onTeam = function (text) {
  return plusOneOf(text, '--turnon');
}

exports.addingTeam = function (text) {
  return plusOneOf(text, '--addteam');
}

exports.teamListRequested = function (text) {
  var tokens = text.split(' ');

  var teamsIdx = tokens.indexOf('--teams');
  if (teamsIdx > -1) {
    if (tokens[teamsIdx + 1][0] != '[') {
      return true;
    }
  }

  return false;
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

exports.parseTargetTeams = function (fn) {
  var tokens = text.split(' ');

  var teamsIdx = tokens.indexOf('--teams');
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
  var parsed = text.split(' ');
  if (parsed.length == 1) return true;
  if (parsed[1] == 'help') return true;
  return false;
}

exports.helpMessage = function (fn) {
  db.allTeams(function (err, teams) {
    if (err) return fn(err);

    var teamsDisplay = '';
    teams.forEach(t => {
      teamsDisplay += `• ${t.domain} -->> ${t.display}\n`;
    });

    return fn(null, `Welcome to broadcast! A Slack bot for sending messages across Slack teams.
To use broadcast, simply type:
\`broadcast: <your message here>\`

To target your message to only a few teams, choose some domain names (the part before -->> from the list below) and type:
\`broadcast: --teams [domain name 1, domain name 2, ...] <your message here>\`
Note – anything in between [ and ] will be interpreted as a team domain.

To disable the ability to recieve messages from a team, type:
\`broadcast: --turnoff <team domain>\`

To re-enable that ability after you've turned it off, type:
\`broadcast: --turnon <team domain>\`

If you'd like to see this help message, including the list of teams and their domains, type:
\`broadcast: help\` or \`broadcast:\` with nothing after.

If you'd just like to see the list of connected teams, type:
\`broadcast: --teams\` with nothing after.

You currently have ${teams.length} teams connected to your broadcast: they are:
${'```'}
${teamsDisplay}
${'```'}`);
  });
}
