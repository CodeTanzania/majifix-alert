/* dependencies */
import { expect } from 'chai';

/* declarations */
import Alert from '../../src/alert.model';

describe('Alert', () => {
  describe('Schema', () => {
    it('should have jurisdictions field', () => {
      const { jurisdictions } = Alert.schema.tree;
      const { instance } = Alert.schema.paths.jurisdictions;

      expect(instance).to.be.equal('Array');
      expect(jurisdictions).to.exist;
      expect(jurisdictions).to.be.an('object');
      expect(jurisdictions.type[0]).to.be.a('function');
      expect(jurisdictions.type[0].name).to.be.equal('ObjectId');
      expect(jurisdictions.index).to.be.true;
      expect(jurisdictions.exists).to.be.an('object');
      expect(jurisdictions.autopopulate).to.exist;
    });

    it('should have subject field', () => {
      const { subject } = Alert.schema.tree;
      const { instance } = Alert.schema.paths.subject;

      expect(instance).to.be.equal('String');
      expect(subject).to.exist;
      expect(subject).to.be.an('object');
      expect(subject.type).to.be.a('function');
      expect(subject.type.name).to.be.equal('String');
      expect(subject.trim).to.be.true;
    });

    it('should have message field', () => {
      const { message } = Alert.schema.tree;
      const { instance } = Alert.schema.paths.message;

      expect(instance).to.be.equal('String');
      expect(message).to.exist;
      expect(message).to.be.an('object');
      expect(message.type).to.be.a('function');
      expect(message.type.name).to.be.equal('String');
      expect(message.trim).to.be.true;
    });

    it('should have methods field', () => {
      const { methods } = Alert.schema.tree;
      const { instance } = Alert.schema.paths.methods;

      expect(instance).to.be.equal('Array');
      expect(methods).to.exist;
      expect(methods).to.be.an('object');
      expect(methods.type[0]).to.be.a('function');
      expect(methods.type[0].name).to.be.equal('String');
    });
  });
});
