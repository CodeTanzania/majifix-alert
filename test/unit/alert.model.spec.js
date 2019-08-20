import { expect } from 'chai';
import Alert from '../../src/alert.model';

describe('Alert', () => {
  describe('Statics', () => {
    it('should expose model name as constant', () => {
      expect(Alert.MODEL_NAME).to.exist;
      expect(Alert.MODEL_NAME).to.be.equal('Alert');
    });
  });
});
