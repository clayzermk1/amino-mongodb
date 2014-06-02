amino = require('amino')
  .use(require('../'), 'mongodb://test:test@kahana.mongohq.com:10050/clayzermk1')
  .init({ "redis": false });

assert = require('assert');

inArray = require('./helpers/inArray');
