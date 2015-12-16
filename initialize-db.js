var mongoose = require('mongoose');
var log = require('debug')('broadcast:db-setup')

/*
 * Get MONGOLAB_URI or use localhost
 */ 

var MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017';
var MONGOLAB_URI = MONGOLAB_URI + '/broadcast';

/*
 * Start the connection and load the models
 */ 

module.exports = function(app) {
  log('Connecting to MONGO on URI %s', MONGOLAB_URI);
  mongoose.connect(MONGOLAB_URI);
  require('./models')(mongoose.connection);
}
