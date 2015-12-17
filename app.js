var express = require('express');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var log = require('debug')('broadcast:app');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

require('./initialize-db.js')(app);

var argParse = require('./arg-parse');
var db = require('./db-api');
var broadcast = require('./broadcast');

/**
 * Handle requests
 */

app.post('/', function (req, res) {
  log('Recieved message with data %j', req.body);

  /**
   * If they want help, give it to them!
   */
  if (argParse.helpRequested(req.body.text)) {
    argParse.helpMessage(function (err, message) {
      if (err) {
        return res.json({
          text: `@${req.body.user_name}: Sorry – could not recieved help message. Something is wrong! Panic!`
        });
      }

      return res.json({
        text: `@${req.body.user_name}: ${message}`
      });  
    });
  }

  /**
   * If they want to ban or unban a user, do so! (only if they're an admin)
   */
  var bannedUser = argParse.bannedUser(req.body.text);
  var unbannedUser = argParse.unbannedUser(req.body.text);
  if (bannedUser || unbannedUser) {

    db.getUser(req.body.user_name, function (err, banningUser) {
      if (err) return res.json({
        text: err
      });

      if (!banningUser.admin) {
        return res.json({
          text: `Sorry @${req.body.user_name}, you aren't an admin and can't ban or unban people!`
        });
      }

      var banOrUnban = unbannedUser == null;
      db.modifySend(bannedUser || unbannedUser, banOrUnban, function (err, user) {
        if (err) {
          return res.json({
            text: err
          });
        }

        return res.json({
          text: `@${req.body.user_name}: Successfully ${banOrUnban ? 'banned' : 'unbanned'} ${user.username}`
        });
      });

    });
  }

  /**
   * If they want to make someone an admin, or remove their admin privileges, do it!
   */
  var adminUser = argParse.adminUser(req.body.text);
  var deadminUser = argParse.deadminUser(req.body.text);
  if (adminUser || deadminUser) {

    db.getUser(req.body.user_name, function (err, banningUser) {
      if (err) return res.json({
        text: err
      });

      if (!banningUser.admin) {
        return res.json({
          text: `Sorry @${req.body.user_name}, you aren't an admin and can't ban or unban people!`
        });
      }

      var adminOrDeadmin = deadminUser == null;
      db.modifyUserAdmin(adminUser || deadminUser, adminOrDeadmin, function (err, user) {
        if (err) {
          return res.json({
            text: err
          });
        }

        return res.json({
          text: `@${req.body.user_name}: Successfully ${adminOrDeadmin ? 'gave admin privileges to' : 'remove admin privileges from'} ${user.username}`
        });
      });

    });
  }

  /**
   * If they want to turn on or off a team, do it!
   */
  var onTeam = argParse.onTeam(req.body.text);
  var offTeam = argParse.offTeam(req.body.text);
  if (offTeam || onTeam) {
    var onOrOff = offTeam == null;

    db.modifyAccepts(req.body.team_domain, onTeam || offTeam, onOrOff, function (err, reciever) {
      if (err) return res.json({
        text: err
      });

      return res.json({
        text: `@${req.body.user_name}, ${onTeam || offTeam} was successfully turned ${onOrOff ? 'on' : 'off'}`
      });
    });
  }

  /**
   * If they want the team list, give it to them!
   */
  if (argParse.teamListRequested(req.body.text)) {
    argParse.teamList(req.body.team_domain, function (err, message) {
      if (err) {
        return res.json({
          text: `@${req.body.user_name}: Sorry – could not recieved team list. Something is wrong! Panic!`
        });
      }

      return res.json({
        text: `@${req.body.user_name}: Here's your team list! ${message}`
      });
    });
  }

  /**
   * If they want to add a team, do it!
   */
  if (argParse.addingTeam(req.body.text)) {
    eval(`var team = ${req.body.text.substr(req.body.text.indexOf('{'))}`);
    db.addTeam(team, function (err, team) {
      if (err) res.json({
        text: `@${req.body.user_name}: Found error ${err}`
      });

      return res.json({
        text: `@${req.body.user_name}: team ${team.domain} has been added.`
      });
    });
  }

  /**
   * Finally, broadcast!
   */
  broadcast(req.body, argParse.parseTargetTeams(req.body.text), function (err, teams) {
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
