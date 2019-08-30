const _ = require('lodash');
const { waterfall } = require('async');
const { connect, clear } = require('@lykmapipo/mongoose-common');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const { Alert } = require('../lib');

/* track seeding time */
let seedStart;
let seedEnd;

const log = (stage, error, results) => {
  if (error) {
    console.error(`${stage} seed error`, error);
  }

  if (results) {
    const val = _.isArray(results) ? results.length : results;
    console.info(`${stage} seed result`, val);
  }
};

const clearSeed = next => clear(Alert, Jurisdiction, () => next());

const seedJurisdiction = next => Jurisdiction.fake().post(next);

const seedAlert = (jurisdiction, next) => {
  let alerts = Alert.fake(50);

  alerts = _.forEach(alerts, alert => {
    alert.set({ jurisdictions: [jurisdiction] });
    return alert;
  });

  Alert.create(alerts, next);
};

const seed = () => {
  seedEnd = Date.now();
  waterfall([clearSeed, seedJurisdiction, seedAlert], (error, results) => {
    if (error) {
      throw error;
    }
    seedEnd = Date.now();

    log('time', null, seedEnd - seedStart);
    log('final', error, results);
    process.exit(0);
  });
};

// connect and seed
connect(error => {
  if (error) {
    throw error;
  }
  seed();
});
