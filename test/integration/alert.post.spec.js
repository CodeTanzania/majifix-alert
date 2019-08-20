/* dependencies */
import { expect } from 'chai';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { create, clear } from '@lykmapipo/mongoose-test-helpers';
import { Alert } from '../../src/index';

describe('Alert', () => {
  const jurisdiction = Jurisdiction.fake();

  // before(done => {
  //   Jurisdiction.deleteMany(done);
  // });
  before(done => create(jurisdiction, done));

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

  describe('static post', () => {
    let alert;

    it('should be able to post', done => {
      alert = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);

      Alert.post(alert, (error, created) => {
        expect(error).to.not.exist;
        expect(created).to.exist;
        expect(created._id).to.eql(alert._id);
        expect(created.subject).to.equal(alert.subject);

        // assert jurisdiction
        expect(created.jurisdictions).to.exist;

        done(error, created);
      });
    });
  });

  describe('instance post', () => {
    let alert;

    it('should be able to post', done => {
      alert = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);

      alert.post((error, created) => {
        expect(error).to.not.exist;
        expect(created).to.exist;
        expect(created._id).to.eql(alert._id);
        expect(created.subject).to.equal(alert.subject);
        done(error, created);
      });
    });
  });

  after(done => clear('Jurisdiction', 'Alert', done));
});
