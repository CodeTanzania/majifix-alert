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

  describe('static post', function () {

    let alert;

    it('should be able to post', function (done) {

      alert = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);

      Alert
        .post(alert, function (error, created) {
          expect(error).to.not.exist;
          expect(created).to.exist;
          expect(created._id).to.eql(alert._id);
          expect(created.subject).to.equal(alert.subject);

          //assert jurisdiction
          expect(created.jurisdictions).to.exist;

          done(error, created);
        });

    });

  });

  describe('instance post', function () {

    let alert;

    it('should be able to post', function (done) {

      alert = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);

      alert
        .post(function (error, created) {
          expect(error).to.not.exist;
          expect(created).to.exist;
          expect(created._id).to.eql(alert._id);
          expect(created.subject).to.equal(alert.subject);
          done(error, created);
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
