var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
    domain: {type: String, required: true}
  , display: {type: String, required: true}
  , accepts: [{type: mongoose.Schema.ObjectId, ref: 'Team'}]
  , outgoing: {type: Boolean, default: true}
  , notifications: {type: Boolean, default: false}
  , inToken: {type: String, required: true}
  , outUrl: {type: String, required: true}
});

var userSchema = mongoose.Schema({
    username: {type: String, required: true}
  , send: {type: Boolean, default: true}
  , admin: {type: Boolean, default: false}
});

module.exports = function initialize(conn) {
  conn.model('Team', teamSchema);
  conn.model('User', userSchema);
}
