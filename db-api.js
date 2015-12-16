var mongoose = require('mongoose');
var log = require('debug')('broadcast:db-api');

var Team = mongoose.model('Team');
var User = mongoose.model('User');

/**
 * Add a new team with data in `team`
 */
exports.addTeam = function addTeam (team, fn) {
  var newTeam = new Team(team);

  newTeam.save(function (err) {
    if (err) return log(err), fn(err);

    return fn(null, newTeam);
  });
}

/**
 * Add's `sender` to `reciever`'s accepts if `accepts`, else removes
 */
exports.modifyAccepts = function modifyAccepts (recieverDomain, senderDomain, accepts, fn) {
  Team
  .findOne({domain: recieverDomain})
  .exec(function (err, reciever) {
    if (err) return log(err), fn(err);

    Team
    .findOne({domain: senderDomain})
    .exec(function (err, sender) {
      if (err) return log(err), fn(err);

      if (accepts) {
        // add sender to reciever's accepts
        reciever.accepts.push(sender.id);
      } else {
        // if reciever currently accepts sender, remove sender from reciever's accepts
        if (reicever.accepts.indexOf(sender.id) > -1) {
          reciever.accepts.splice(sender.accepts.indexOf(sender.id), 1);
        }
      }

      reciever.save(function (err) {
        if (err) return log(err), fn(err);

        log('Successfully %s %s to %s\'s accepts', accepts ? 'added' : 'removed', senderDomain, recieverDomain);
        return fn(null, reciever);
      });
    });
  });
}

/**
 * Get all teams
 */
exports.allTeams = function allTeams (fn) {
  Team
  .find()
  .exec(function (err, teams) {
    if (err) return log(err), fn(err);

    if (!teams) return log('No teams found – returning null'), fn(null);

    return log('Found teams %s', teams), fn(null, teams);
  });
}

/**
 * Get the teams that `outTeam` is allowed to send messages to
 */
exports.teamsFor = function (outTeamDomain, fn) {
  allTeams(function (err, teams) {
    if (err) return fn(err);

    var outTeamId = teams.filter(function (t) {
      return t.domain == outTeamDomain;
    })[0].id;

    var teamsFor = teams.filter(function (t) {
      return t.accepts.indexOf(outTeamId) > -1;
    });

    log('%s is allowed to send to %s', outTeam, teamsFor);
    return fn(null, teamsFor);
  });
}

/**
 * Get a particular user
 */
exports.getUser = function getUser (username, fn) {
  User
  .findOne({username: username})
  .exec(function (err, user) {
    if (err) return log(err), fn(err);

    if (!user) return log('User with username %s not found', username), fn(null);

    return fn(null, user);
  });
}

/**
 * Get a particular user, creating one if it doesn't exist
 */
exports.ensureUser = function ensureUser (username, fn) {
  getUser(function (err, user) {
    if (err) return log(err), fn(err);

    if (!user) {
      log('User with username %s not found, creating one...', username);
      var newUser = new User({username: username});
      newUser.save(function (err) {
        if (err) return log(err), fn(err);

        fn(null, newUser);
      });
    }

    return fn(null, user);
  });
}

/**
 * Makes user with username admin
 */
exports.makeUserAdmin = function (username, fn) {
  ensureUser(username, function (err, user) {
    if (err) return fn(err); if (!user) fn(null);

    user.admin = true;
    user.save(function (err, user) {
      if (err) return log(err), fn(err);

      return log('Make %s admin', username), fn(null, user);
    });
  });
}

/**
 * Ban a particular user
 */
exports.modifySend = function (username, canSend, fn) {
  ensureUser(username, function (err, user) {
    if (err) return fn(err); if (!user) fn(null);

    user.send = canSend;
    user.save(function (err, user) {
      if (err) return log(err), fn(err);

      return log('Make user %s\'s send privileges = %s', username, canSend), fn(null, user);
    });
  });
}

