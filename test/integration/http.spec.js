'use strict';

/* dependencies */
const path = require('path');
const request = require('supertest');
const { expect } = require('chai');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const {
  Alert,
  apiVersion,
  app
} = require(path.join(__dirname, '..', '..'));


describe('Alert', () => {

  describe('Rest API', () => {

    let jurisdiction;
    let alert;

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


    it('should handle HTTP POST on /alerts', done => {

      alert = Alert.fake();
      alert.jurisdictions = [].concat(jurisdiction);

      request(app)
        .post(`/v${apiVersion}/alerts`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(alert)
        .expect(201)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const created = response.body;

          expect(created._id).to.exist;
          expect(created.subject).to.exist;

          done(error, response);

        });

    });

    it('should handle HTTP GET on /alerts', done => {

      request(app)
        .get(`/v${apiVersion}/alerts`)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          //assert payload
          const result = response.body;
          expect(result.data).to.exist;
          expect(result.total).to.exist;
          expect(result.limit).to.exist;
          expect(result.skip).to.exist;
          expect(result.page).to.exist;
          expect(result.pages).to.exist;
          expect(result.lastModified).to.exist;
          done(error, response);

        });

    });

    it('should handle HTTP GET on /alerts/id:', done => {

      request(app)
        .get(`/v${apiVersion}/alerts/${alert._id}`)
        .set('Accept', 'application/json')
        .expect(200)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const found = response.body;
          expect(found._id).to.exist;
          expect(found._id).to.be.equal(alert._id.toString());
          expect(found.subject).to.be.equal(alert.subject);

          done(error, response);

        });

    });

    it('should handle HTTP PATCH on /alerts/id:', done => {

      const patch = alert.fakeOnly('subject');

      request(app)
        .patch(`/v${apiVersion}/alerts/${alert._id}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(patch)
        .expect(200)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const patched = response.body;

          expect(patched._id).to.exist;
          expect(patched._id).to.be.equal(alert._id.toString());
          expect(patched.subject).to.be.equal(alert.subject);

          done(error, response);

        });

    });

    it('should handle HTTP PUT on /alerts/id:', done => {

      const put = alert.fakeOnly('subject');

      request(app)
        .put(`/v${apiVersion}/alerts/${alert._id}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(put)
        .expect(200)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const updated = response.body;

          expect(updated._id).to.exist;
          expect(updated._id).to.be.equal(alert._id.toString());
          expect(updated.subject).to.be.equal(alert.subject);

          done(error, response);

        });

    });

    it('should handle HTTP DELETE on /alerts/:id', done => {

      request(app)
        .delete(`/v${apiVersion}/alerts/${alert._id}`)
        .set('Accept', 'application/json')
        .expect(200)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const deleted = response.body;

          expect(deleted._id).to.exist;
          expect(deleted._id).to.be.equal(alert._id.toString());
          expect(deleted.subject).to.be.equal(alert.subject);

          done(error, response);

        });

    });

    after(done => {
      Alert.deleteMany(done);
    });

  });

});
