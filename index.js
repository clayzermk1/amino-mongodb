var PubSub = require('mongodb-pubsub')
  , EventEmitter = require('events').EventEmitter;

exports.attach = function (options) {
  var amino = this
    , subscriber = new EventEmitter()
    , client;

  if (typeof options === 'string') {
    options = { "uri": options, "collection": options.collection || "buffer" };
  }
  else {
    options = { "uri": options.uri || "mongodb://localhost:27017/amino", "collection": options.collection || "buffer" };
  }

  amino.mongodb = client = new PubSub(options.uri, options.collection);

  subscriber.setMaxListeners(0);

  client.on('error', amino.emit.bind(amino, 'error'));
  client.on('subscribe', amino.emit.bind(amino, 'subscribe'));
  client.on('unsubscribe', amino.emit.bind(amino, 'unsubscribe'));

  client.on('message', function (ev, packet) {
    try {
      subscriber.emit.apply(subscriber, packet.args);
    }
    catch (e) {
      amino.emit('error', e);
    }
  });

  amino.publish = function () {
    try {
      client.publish.apply(client, arguments);
    }
    catch (e) {
      amino.emit('error', e);
    }
  };

  amino.subscribe = function (ev, handler) {
    subscriber.on(ev, handler);
    client.subscribe(ev, function () {});
  };

  amino.unsubscribe = function (ev, handler) {
    if (handler) {
      subscriber.removeListener(ev, handler);
    }
    else {
      subscriber.removeAllListeners(ev);
    }
    if (subscriber.listeners(ev).length === 0) {
      client.unsubscribe(ev);
    }
  };
};
