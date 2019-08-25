import _ from 'lodash';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { clear, create, expect } from '@lykmapipo/mongoose-test-helpers';
import { Alert } from '../../src/index';

describe('Alert', () => {
  const jurisdiction = Jurisdiction.fake();

  before(done => clear(Alert, Jurisdiction, done));

  before(done => create(jurisdiction, done));

  describe('static patch', () => {
    let alert;

    before(done => {
      alert = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);
      alert.post((error, created) => {
        alert = created;
        done(error, created);
      });
    });

    it('should be able to patch', done => {
      alert = alert.fakeOnly('subject');

      Alert.patch(alert._id, alert, (error, updated) => {
        expect(error).to.not.exist;
        expect(updated).to.exist;
        expect(updated._id).to.eql(alert._id);
        expect(updated.subject).to.equal(alert.subject);

        // assert jurisdiction
        expect(updated.jurisdictions).to.exist;
        done(error, updated);
      });
    });

    it('should throw if not exists', done => {
      const fake = Alert.fake().toObject();
      fake.jurisdictions = [].concat(jurisdiction);

      Alert.patch(fake._id, _.omit(fake, '_id'), (error, updated) => {
        expect(error).to.exist;
        // expect(error.status).to.exist;
        expect(error.name).to.be.equal('DocumentNotFoundError');
        expect(updated).to.not.exist;
        done();
      });
    });
  });

  describe('instance patch', () => {
    let alert;

    before(done => {
      alert = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);
      alert.post((error, created) => {
        alert = created;
        done(error, created);
      });
    });

    it('should be able to patch', done => {
      alert = alert.fakeOnly('name');

      alert.patch((error, updated) => {
        expect(error).to.not.exist;
        expect(updated).to.exist;
        expect(updated._id).to.eql(alert._id);
        expect(updated.subject).to.equal(alert.subject);
        done(error, updated);
      });
    });

    it('should throw if not exists', done => {
      alert.patch((error, updated) => {
        expect(error).to.not.exist;
        expect(updated).to.exist;
        expect(updated._id).to.eql(alert._id);
        done();
      });
    });
  });

  after(done => clear('Alert', 'Jurisdiction', done));
});
