var PubSub = require('mongodb-pubsub')
  , EventEmitter = require('events').EventEmitter;

exports.attach = function (options) {
  var amino = this;

  if (typeof options === 'string') {
    options = { "uri": (options || {}), "collection": (options || {}).collection || "buffer" };
  }
  else {
    options = { "uri": (options || {}).uri || "mongodb://localhost:27017/amino", "collection": (options || {}).collection || "buffer" };
  }

  amino.mongodb = new PubSub(options.uri, options.collection);

  amino.mongodb.open(function () {
    amino.mongodb._channels.setMaxListeners(0);
    amino.mongodb.connected = (amino.mongodb._db._state === 'connected'); // monkey-patch the db state
  });

  // alias events
  amino.mongodb.on('error', amino.emit.bind(amino, 'error'));
  amino.mongodb.on('publish', amino.emit.bind(amino, 'publish'));
  amino.mongodb.on('subscribe', amino.emit.bind(amino, 'subscribe'));
  amino.mongodb.on('unsubscribe', amino.emit.bind(amino, 'unsubscribe'));

  // alias functions
  amino.publish = amino.mongodb.publish.bind(amino.mongodb);
  amino.subscribe = amino.mongodb.subscribe.bind(amino.mongodb);
  amino.unsubscribe = amino.mongodb.unsubscribe.bind(amino.mongodb);
};
