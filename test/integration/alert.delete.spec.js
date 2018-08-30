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

  describe('static delete', function () {

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

    it('should be able to delete', function (done) {

      Alert
        .del(alert._id, function (error, deleted) {
          expect(error).to.not.exist;
          expect(deleted).to.exist;
          expect(deleted._id).to.eql(alert._id);

          //assert jurisdictions
          expect(deleted.jurisdictions).to.exist;
          done(error, deleted);

        });

    });

    it('should throw if not exists', function (done) {

      Alert
        .del(alert._id, function (error, deleted) {
          expect(error).to.exist;
          expect(error.status).to.exist;
          expect(error.message).to.be.equal('Not Found');
          expect(deleted).to.not.exist;
          done();
        });

    });

  });

  describe('instance delete', function () {

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

    it('should be able to delete', function (done) {
      alert
        .del(function (error, deleted) {
          expect(error).to.not.exist;
          expect(deleted).to.exist;
          expect(deleted._id).to.eql(alert._id);
          done(error, deleted);
        });
    });

    it('should throw if not exists', function (done) {

      alert
        .del(function (error, deleted) {
          expect(error).to.not.exist;
          expect(deleted).to.exist;
          expect(deleted._id).to.eql(alert._id);
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
