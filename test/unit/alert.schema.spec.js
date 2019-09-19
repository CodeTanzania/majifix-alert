import { expect } from '@lykmapipo/express-test-helpers';
import { SchemaTypes } from '@lykmapipo/mongoose-common';

import Alert from '../../src/alert.model';

describe.only('Alert Schema', () => {
  it('should have jurisdictions field', () => {
    const jurisdiction = Alert.path('jurisdictions');

    expect(jurisdiction).to.exist;
    expect(jurisdiction).to.be.instanceof(SchemaTypes.Array);
    expect(jurisdiction.options).to.exist;
    expect(jurisdiction.options).to.be.an('object');
    expect(jurisdiction.options.type[0]).to.be.a('function');
    expect(jurisdiction.options.type[0].name).to.be.equal('ObjectId');
    expect(jurisdiction.options.ref).to.exist.and.be.equal('Jurisdiction');
    expect(jurisdiction.options.exists).to.exist.and.be.an('object');
    expect(jurisdiction.options.autopopulate).to.exist.and.an('object');
    expect(jurisdiction.options.required).to.be.true;
    expect(jurisdiction.options.index).to.be.true;
  });

  it('should have subject field', () => {
    const subject = Alert.path('subject');

    expect(subject).to.exist;
    expect(subject).to.be.instanceof(SchemaTypes.String);
    expect(subject.options).to.exist;
    expect(subject.options).to.be.an('object');
    expect(subject.options.type).to.be.a('function');
    expect(subject.options.type.name).to.be.equal('String');
    expect(subject.options.trim).to.be.true;
    expect(subject.options.required).to.be.true;
    expect(subject.options.index).to.be.true;
    expect(subject.options.taggable).to.be.true;
    expect(subject.options.exportable).to.be.true;
    expect(subject.options.searchable).to.be.true;
    expect(subject.options.fake).to.exist;
  });

  it('should have message field', () => {
    const message = Alert.path('message');

    expect(message).to.exist;
    expect(message).to.be.instanceof(SchemaTypes.String);
    expect(message.options).to.exist;
    expect(message.options).to.be.an('object');
    expect(message.options.type).to.be.a('function');
    expect(message.options.type.name).to.be.equal('String');
    expect(message.options.trim).to.be.true;
    expect(message.options.required).to.be.true;
    expect(message.options.index).to.be.true;
    expect(message.options.exportable).to.be.true;
    expect(message.options.searchable).to.be.true;
    expect(message.options.fake).to.exist;
  });

  it.only('should have methods field', () => {
    const methods = Alert.path('methods');

    expect(methods).to.exist;
    expect(methods).to.be.instanceof(SchemaTypes.Array);
    expect(methods.options).to.exist;
    expect(methods.options).to.be.an('object');
    expect(methods.options.type[0]).to.be.a('function');
    expect(methods.options.type[0].name).to.be.equal('String');
    expect(methods.options.required).to.be.true;
    expect(methods.options.enum).to.exist;
    expect(methods.options.default).to.exist;
    expect(methods.options.index).to.be.true;
    expect(methods.options.taggable).to.be.true;
    expect(methods.options.exportable).to.be.true;
    expect(methods.options.searchable).to.be.true;
    expect(methods.options.fake).to.be.true;
  });
});
