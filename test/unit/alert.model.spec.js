import { expect } from '@lykmapipo/express-test-helpers';
import Alert from '../../src/alert.model';

describe('Alet Statics', () => {
  it('should expose model name as constant', () => {
    expect(Alert.MODEL_NAME).to.exist;
    expect(Alert.MODEL_NAME).to.be.equal('Alert');
  });
});
