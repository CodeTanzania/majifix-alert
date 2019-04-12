'use strict';

/* dependencies */
const path = require('path');
const _ = require('lodash');
const { expect } = require('chai');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const { Alert } = require(path.join(__dirname, '..', '..'));

describe('Alert', () => {

  let jurisdiction;

  before(done => {
    Jurisdiction.deleteMany(done);
  });

  before(done => {
    jurisdiction = Jurisdiction.fake();
    jurisdiction.post((error, created) => {
      jurisdiction = created;
      done(error, created);
    });
  });

  before(done => {
    Alert.deleteMany(done);
  });

  describe('get by id', () => {

    let alert;

    before(done => {
      alert = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);
      alert
        .post((error, created) => {
          alert = created;
          done(error, created);
        });
    });

    it('should be able to get an instance', done => {

      Alert
        .getById(alert._id, (error, found) => {
          expect(error).to.not.exist;
          expect(found).to.exist;
          expect(found._id).to.eql(alert._id);

          //assert jurisdiction
          expect(found.jurisdictions).to.exist;
          done(error, found);
        });

    });

    it('should be able to get with options', done => {

      const options = {
        _id: alert._id,
        select: 'subject'
      };

      Alert
        .getById(options, (error, found) => {
          expect(error).to.not.exist;
          expect(found).to.exist;
          expect(found._id).to.eql(alert._id);
          expect(found.subject).to.exist;

          //...assert selection
          const fields = _.keys(found.toObject());
          expect(fields).to.have.length(3);
          _.map([
            'message'
          ], field => {
            expect(fields).to.not.include(field);
          });


          done(error, found);
        });

    });

    it('should throw if not exists', done => {

      const alert = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);

      Alert
        .getById(alert._id, (error, found) => {
          expect(error).to.exist;
          expect(error.status).to.exist;
          expect(error.message).to.be.equal('Not Found');
          expect(found).to.not.exist;
          done();
        });

    });

  });

  after(done => {
    Alert.deleteMany(done);
  });

  after(done => {
    Jurisdiction.deleteMany(done);
  });

});
