'use strict';

/* dependencies */
const path = require('path');
const _ = require('lodash');
const { expect } = require('chai');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const { Alert } = require(path.join(__dirname, '..', '..'));

describe('Alert', function () {

  let jurisdiction;

  before(function (done) {
    Jurisdiction.deleteMany(done);
  });

  before(function (done) {
    jurisdiction = Jurisdiction.fake();
    jurisdiction.post(function (error, created) {
      jurisdiction = created;
      done(error, created);
    });
  });

  before(function (done) {
    Alert.deleteMany(done);
  });

  describe('get by id', function () {

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

    it('should be able to get an instance', function (done) {

      Alert
        .getById(alert._id, function (error, found) {
          expect(error).to.not.exist;
          expect(found).to.exist;
          expect(found._id).to.eql(alert._id);

          //assert jurisdiction
          expect(found.jurisdictions).to.exist;
          done(error, found);
        });

    });

    it('should be able to get with options', function (done) {

      const options = {
        _id: alert._id,
        select: 'subject'
      };

      Alert
        .getById(options, function (error, found) {
          expect(error).to.not.exist;
          expect(found).to.exist;
          expect(found._id).to.eql(alert._id);
          expect(found.subject).to.exist;

          //...assert selection
          const fields = _.keys(found.toObject());
          expect(fields).to.have.length(3);
          _.map([
            'message'
          ], function (field) {
            expect(fields).to.not.include(field);
          });


          done(error, found);
        });

    });

    it('should throw if not exists', function (done) {

      const alert = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);

      Alert
        .getById(alert._id, function (error, found) {
          expect(error).to.exist;
          expect(error.status).to.exist;
          expect(error.message).to.be.equal('Not Found');
          expect(found).to.not.exist;
          done();
        });

    });

  });

  after(function (done) {
    Alert.deleteMany(done);
  });

  after(function (done) {
    Jurisdiction.deleteMany(done);
  });

});
