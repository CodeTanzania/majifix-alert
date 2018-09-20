'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');


/* declarations */
const Alert =
  require(path.join(__dirname, '..', '..', 'lib', 'alert.model'));


describe('Alert', function () {

  describe('Schema', function () {

    it('should have jurisdictions field', function () {

      const jurisdictions = Alert.schema.tree.jurisdictions;
      const instance = Alert.schema.paths.jurisdictions.instance;

      expect(instance).to.be.equal('Array');
      expect(jurisdictions).to.exist;
      expect(jurisdictions).to.be.an('object');
      expect(jurisdictions.type[0]).to.be.a('function');
      expect(jurisdictions.type[0].name).to.be.equal('ObjectId');
      expect(jurisdictions.index).to.be.true;
      expect(jurisdictions.exists).to.be.an('object');
      expect(jurisdictions.autopopulate).to.exist;

    });

    it('should have subject field', function () {

      const subject = Alert.schema.tree.subject;
      const instance = Alert.schema.paths.subject.instance;

      expect(instance).to.be.equal('String');
      expect(subject).to.exist;
      expect(subject).to.be.an('object');
      expect(subject.type).to.be.a('function');
      expect(subject.type.name).to.be.equal('String');
      expect(subject.trim).to.be.true;

    });

    it('should have message field', function () {

      const message = Alert.schema.tree.message;
      const instance = Alert.schema.paths.message.instance;

      expect(instance).to.be.equal('String');
      expect(message).to.exist;
      expect(message).to.be.an('object');
      expect(message.type).to.be.a('function');
      expect(message.type.name).to.be.equal('String');
      expect(message.trim).to.be.true;

    });

    it('should have methods field', function () {

      const methods = Alert.schema.tree.methods;
      const instance = Alert.schema.paths.methods.instance;

      expect(instance).to.be.equal('Array');
      expect(methods).to.exist;
      expect(methods).to.be.an('object');
      expect(methods.type[0]).to.be.a('function');
      expect(methods.type[0].name).to.be.equal('String');

    });

  });

});
