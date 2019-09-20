import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { clear, create, expect } from '@lykmapipo/mongoose-test-helpers';
import { Alert } from '../../src/index';

describe('Alert static delete', () => {
  const jurisdiction = Jurisdiction.fake();

  before(done => clear(Alert, Jurisdiction, done));

  before(done => create(jurisdiction, done));

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
      // expect(error.status).to.exist;
      expect(error.name).to.be.equal('DocumentNotFoundError');
      expect(deleted).to.not.exist;
      done();
    });
  });

  after(done => clear('Alert', 'Jurisdiction', done));
});

describe('Alert instance delete', () => {
  const jurisdiction = Jurisdiction.fake();

  before(done => clear(Alert, Jurisdiction, done));

  before(done => create(jurisdiction, done));

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

  after(done => clear('Alert', 'Jurisdiction', done));
});
