import { expect } from 'chai';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { create, clear } from '@lykmapipo/mongoose-test-helpers';
import { Alert } from '../../src/index';

describe('Alert', () => {
  const jurisdiction = Jurisdiction.fake();

  before(done => create(jurisdiction, done));
  // before(done => {
  //   Jurisdiction.deleteMany(done);
  // });

  // before(done => {
  //   jurisdiction = Jurisdiction.fake();
  //   jurisdiction.post((error, created) => {
  //     jurisdiction = created;
  //     done(error, created);
  //   });
  // });

  // before(done => {
  //   Alert.deleteMany(done);
  // });

  describe('static delete', () => {
    let alert;

    before(done => {
      alert = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);
      alert.post((error, created) => {
        alert = created;
        done(error, created);
      });
    });

    it('should be able to delete', done => {
      Alert.del(alert._id, (error, deleted) => {
        expect(error).to.not.exist;
        expect(deleted).to.exist;
        expect(deleted._id).to.eql(alert._id);

        // assert jurisdictions
        expect(deleted.jurisdictions).to.exist;
        done(error, deleted);
      });
    });

    it('should throw if not exists', done => {
      Alert.del(alert._id, (error, deleted) => {
        expect(error).to.exist;
        expect(error.status).to.exist;
        expect(error.message).to.be.equal('Not Found');
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
      alert.post((error, created) => {
        alert = created;
        done(error, created);
      });
    });

    it('should be able to delete', done => {
      alert.del((error, deleted) => {
        expect(error).to.not.exist;
        expect(deleted).to.exist;
        expect(deleted._id).to.eql(alert._id);
        done(error, deleted);
      });
    });

    it('should throw if not exists', done => {
      alert.del((error, deleted) => {
        expect(error).to.not.exist;
        expect(deleted).to.exist;
        expect(deleted._id).to.eql(alert._id);
        done();
      });
    });
  });

  after(done => clear('Alert', 'Jurisdiction', done));
});
