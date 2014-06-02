amino = require('amino')
  .use(require('../'))
  .init({redis: false, mongodb: 'mongodb://test:test@kahana.mongohq.com:10050/clayzermk1'});

assert = require('assert');

inArray = require('./helpers/inArray');
