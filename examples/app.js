'use strict';

/* ensure mongo uri */
process.env.MONGODB_URI =
  (process.env.MONGODB_URI || 'mongodb://localhost/majifix-alert');


/* dependencies */
const path = require('path');
const _ = require('lodash');
const async = require('async');
const mongoose = require('mongoose');
// mongoose.set('debug', true);
const { start } = require('@lykmapipo/express-common');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const {
  Alert,
  apiVersion,
  info,
  app
} = require(path.join(__dirname, '..'));
let samples = require('./samples')(20);


/* connect to mongoose */
mongoose.connect(process.env.MONGODB_URI);


function boot() {

  async.waterfall([

    function clear(next) {
      Alert.deleteMany(function ( /*error, results*/ ) {
        next();
      });
    },

    function clear(next) {
      Jurisdiction.deleteMany(function ( /*error, results*/ ) {
        next();
      });
    },

    function seedJurisdiction(next) {
      const jurisdiction = Jurisdiction.fake();
      jurisdiction.post(next);
    },

    function seed(jurisdiction, next) {
      /* fake alerts */
      samples = _.map(samples, function (sample) {
        sample.jurisdictions = [].concat(jurisdiction);
        return sample;
      });
      Alert.create(samples, next);
    }

  ], function (error, results) {

    console.log(error);

    /* expose module info */
    app.get('/', function (request, response) {
      response.status(200);
      response.json(info);
    });

    /* fire the app */
    start(function (error, env) {
      console.log(
        `visit http://0.0.0.0:${env.PORT}/${apiVersion}/alerts`
      );
    });

  });

}

boot();
