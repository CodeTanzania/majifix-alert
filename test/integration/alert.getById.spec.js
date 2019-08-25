import _ from 'lodash';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { clear, create, expect } from '@lykmapipo/mongoose-test-helpers';
import { Alert } from '../../src/index';

describe('Alert', () => {
  const jurisdiction = Jurisdiction.fake();

  before(done => clear(Alert, Jurisdiction, done));

  before(done => create(jurisdiction, done));

  describe('get by id', () => {
    let alert;

    before(done => {
      alert = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);
      alert.post((error, created) => {
        alert = created;
        done(error, created);
      });
    });

    it('should be able to get an instance', done => {
      Alert.getById(alert._id, (error, found) => {
        expect(error).to.not.exist;
        expect(found).to.exist;
        expect(found._id).to.eql(alert._id);

        // assert jurisdiction
        expect(found.jurisdictions).to.exist;
        done(error, found);
      });
    });

    it('should be able to get with options', done => {
      const options = {
        _id: alert._id,
        select: 'subject',
      };

      Alert.getById(options, (error, found) => {
        expect(error).to.not.exist;
        expect(found).to.exist;
        expect(found._id).to.eql(alert._id);
        expect(found.subject).to.exist;

        // ...assert selection
        const fields = _.keys(found.toObject());
        expect(fields).to.have.length(3);
        _.map(['message'], field => {
          expect(fields).to.not.include(field);
        });

        done(error, found);
      });
    });

    it('should throw if not exists', done => {
      alert = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);

      Alert.getById(alert._id, (error, found) => {
        expect(error).to.exist;
        // expect(error.status).to.exist;
        expect(error.name).to.be.equal('DocumentNotFoundError');
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
