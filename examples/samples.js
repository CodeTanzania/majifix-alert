'use strict';

/* dependencies */
const _ = require('lodash');
const faker = require('@benmaruchu/faker');

function sample() {
  return {
    subject: faker.hacker.noun(),
    message: faker.lorem.sentence(),
  };
}

module.exports = function (size = 10) {
  size = size > 0 ? size : 10;
  return _.times(size, sample);
};
