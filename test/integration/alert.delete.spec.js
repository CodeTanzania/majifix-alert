'use strict';

/* dependencies */
const path = require('path');
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

  describe('static delete', () => {

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

    it('should be able to delete', done => {

      Alert
        .del(alert._id, (error, deleted) => {
          expect(error).to.not.exist;
          expect(deleted).to.exist;
          expect(deleted._id).to.eql(alert._id);

          //assert jurisdictions
          expect(deleted.jurisdictions).to.exist;
          done(error, deleted);

        });

    });

    it('should throw if not exists', done => {

      Alert
        .del(alert._id, (error, deleted) => {
          expect(error).to.exist;
          // expect(error.status).to.exist;
          expect(error.name).to.be.equal('DocumentNotFoundError');
          expect(deleted).to.not.exist;
          done();
        });

    });

  });

  describe('instance delete', () => {

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

    it('should be able to delete', done => {
      alert
        .del((error, deleted) => {
          expect(error).to.not.exist;
          expect(deleted).to.exist;
          expect(deleted._id).to.eql(alert._id);
          done(error, deleted);
        });
    });

    it('should throw if not exists', done => {

      alert
        .del((error, deleted) => {
          expect(error).to.not.exist;
          expect(deleted).to.exist;
          expect(deleted._id).to.eql(alert._id);
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
