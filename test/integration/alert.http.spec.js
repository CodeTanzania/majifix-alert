import {
  clear as clearHttp,
  testRouter,
} from '@lykmapipo/express-test-helpers';
import {
  clear as clearDb,
  expect,
  create,
} from '@lykmapipo/mongoose-test-helpers';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { Alert, alertRouter } from '../../src/index';

describe('Alert Rest API', () => {
  const jurisdiction = Jurisdiction.fake();
  const alert = Alert.fake();
  alert.jurisdictions = [].concat(jurisdiction);

  const options = {
    pathSingle: '/alerts/:id',
    pathList: '/alerts/',
    pathSchema: '/alerts/schema/',
    pathExport: '/alerts/export/',
    pathJurisdiction: '/jurisdictions/:jurisdiction/alerts',
  };

  before(done => clearDb(Alert, Jurisdiction, done));

  before(() => clearHttp());

  before(done => create(jurisdiction, done));

  it('should handle HTTP POST on /alerts', done => {
    const { testPost } = testRouter(options, alertRouter);
    testPost({ ...alert.toObject() })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const created = new Alert(body);
        expect(created._id).to.exist.and.be.eql(alert._id);
        expect(created.subject).to.exist.and.be.eql(alert.subject);
        done(error, body);
      });
  });

  it('should handle HTTP GET /alerts/schema', done => {
    const { testGetSchema } = testRouter(options, alertRouter);
    testGetSchema().expect(200, done);
  });

  it('should handle HTTP GET /alerts/export', done => {
    const { testGetExport } = testRouter(options, alertRouter);
    testGetExport()
      .expect('Content-Type', 'text/csv; charset=utf-8')
      .expect(({ headers }) => {
        expect(headers['content-disposition']).to.exist;
      })
      .expect(200, done);
  });

  it('should handle HTTP GET on /alerts', done => {
    const { testGet } = testRouter(options, alertRouter);
    testGet({ alert })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        expect(body.data).to.exist;
        expect(body.total).to.exist;
        expect(body.limit).to.exist;
        expect(body.skip).to.exist;
        expect(body.page).to.exist;
        expect(body.pages).to.exist;
        expect(body.lastModified).to.exist;
        done(error, body);
      });
  });

  it('should handle HTTP GET on /alerts/id:', done => {
    const { testGet } = testRouter(options, alertRouter);
    const params = { id: alert._id.toString() };
    testGet(params)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const found = new Alert(body);
        expect(found._id).to.exist.and.be.eql(alert._id);
        expect(found.subject).to.exist.and.be.eql(alert.subject);
        done(error, body);
      });
  });

  it('should handle HTTP PATCH on /alerts/id:', done => {
    const { testPatch } = testRouter(options, alertRouter);
    const { subject } = alert.fakeOnly('subject');
    const params = { id: alert._id.toString() };
    testPatch(params, { subject })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const patched = new Alert(body);
        expect(patched._id).to.exist.and.be.eql(alert._id);
        expect(patched.subject).to.exist.and.be.eql(alert.subject);
        done(error, body);
      });
  });

  it('should handle HTTP PUT on /alerts/id:', done => {
    const { testPut } = testRouter(options, alertRouter);
    const { subject } = alert.fakeOnly('subject');
    const params = { id: alert._id.toString() };
    testPut(params, { subject })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const put = new Alert(body);
        expect(put._id).to.exist.and.be.eql(alert._id);
        expect(put.subject).to.be.equal(alert.subject);
        done(error, body);
      });
  });

  it('should handle HTTP DELETE on /alerts/:id', done => {
    const { testDelete } = testRouter(options, alertRouter);
    const params = { id: alert._id.toString() };
    testDelete(params)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const deleted = new Alert(body);
        expect(deleted._id).to.exist.and.be.eql(alert._id);
        expect(deleted.subject).to.exist.and.be.eql(alert.subject);
        done(error, body);
      });
  });
  after(() => clearHttp());

  after(done => clearDb(Alert, Jurisdiction, done));
});
