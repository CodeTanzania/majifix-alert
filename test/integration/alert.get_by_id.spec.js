/* dependencies */
import _ from 'lodash';
import { expect } from 'chai';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { clear, create } from '@lykmapipo/mongoose-test-helpers';
import { Alert } from '../../src/index';

describe('Alert', () => {
  const jurisdiction = Jurisdiction.fake();
  let alert;

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
  before(done => {
    alert = Alert.fake();
    alert.jurisdictions = [].concat(jurisdiction);
    alert.post((error, created) => {
      alert = created;
      done(error, created);
    });
  });

  describe('get by id', () => {
    // let alert;

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
      const alertFake = Alert.fake();
      alertFake.jurisdictions = [].concat(jurisdiction);

      Alert.getById(alertFake._id, (error, found) => {
        expect(error).to.exist;
        expect(error.status).to.exist;
        expect(error.message).to.be.equal('Not Found');
        expect(found).to.not.exist;
        done();
      });
    });
  });

  after(done => clear('Alert', 'Jurisdiction', done));
});
