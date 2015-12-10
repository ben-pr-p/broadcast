var teams = require('./data');

exports.helpRequested = function (text) {
  var parsed = text.split(' ');
  if (parsed.length == 1) return true;
  if (parsed[1] == 'help') return true;
  return false;
}

exports.helpMessage = function () {
  return `> Welcome to broadcast! A Slack bot for sending messages across Slack teams. To use broadcast, simply type:
   > \`broadcast: <your message here>\`

   > If you'd like to see this help message, type:
   > \`broadcast: help\` or \`broadcast:\` with nothing after.

   > You currently have ${teams.length} teams connected to your broadcast: they are:
   >  ${teams.map(t => t.team_display).join(', ')}`;
}
