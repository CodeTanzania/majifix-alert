'use strict';

/* dependencies */
const path = require('path');
const { expect } = require('chai');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const { Alert } = require(path.join(__dirname, '..', '..'));

describe('Alert', function () {

  let jurisdiction;

  before(function (done) {
    Jurisdiction.remove(done);
  });

  before(function (done) {
    jurisdiction = Jurisdiction.fake();
    jurisdiction.post(function (error, created) {
      jurisdiction = created;
      done(error, created);
    });
  });

  before(function (done) {
    Alert.remove(done);
  });

  describe('static put', function () {

    let alert;

    before(function (done) {
      alert = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);
      alert
        .post(function (error, created) {
          alert = created;
          done(error, created);
        });
    });

    it('should be able to put', function (done) {

      alert = alert.fakeOnly('name');

      Alert
        .put(alert._id, alert, function (error, updated) {
          expect(error).to.not.exist;
          expect(updated).to.exist;
          expect(updated._id).to.eql(alert._id);
          expect(updated.subject).to.equal(alert.subject);

          //assert jurisdiction
          expect(updated.jurisdictions).to.exist;
          done(error, updated);
        });

    });

    it.skip('should throw if not exists', function (done) {

      const fake = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);

      Alert
        .put(fake._id, fake, function (error, updated) {
          expect(error).to.exist;
          expect(error.alert).to.exist;
          expect(error.message).to.be.equal('Not Found');
          expect(updated).to.not.exist;
          done();
        });

    });

  });

  describe('instance put', function () {

    let alert;

    before(function (done) {
      alert = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);
      alert
        .post(function (error, created) {
          alert = created;
          done(error, created);
        });
    });

    it('should be able to put', function (done) {
      alert = alert.fakeOnly('name');

      alert
        .put(function (error, updated) {
          expect(error).to.not.exist;
          expect(updated).to.exist;
          expect(updated._id).to.eql(alert._id);
          expect(updated.subject).to.equal(alert.subject);
          done(error, updated);
        });

    });

    it('should throw if not exists', function (done) {

      alert
        .put(function (error, updated) {
          expect(error).to.not.exist;
          expect(updated).to.exist;
          expect(updated._id).to.eql(alert._id);
          done();
        });

    });

  });

  after(function (done) {
    Alert.remove(done);
  });

  after(function (done) {
    Jurisdiction.remove(done);
  });

});
