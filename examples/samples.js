'use strict';

/* dependencies */
const _ = require('lodash');
const faker = require('@benmaruchu/faker');

function sample() {
  return {
    receivers: ['Employees'],
    subject: faker.hacker.noun(),
    message: faker.lorem.sentence(),
    statistics: {
      SMS: {
        sent: faker.random.number(5555, 9999),
        delivered: faker.random.number(3333, 4444),
        failed: faker.random.number(1111, 2222),
      }
    }
  };
}

module.exports = function (size = 10) {
  size = size > 0 ? size : 10;
  return _.times(size, sample);
};
