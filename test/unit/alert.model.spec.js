'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');


/* declarations */
const Alert =
  require(path.join(__dirname, '..', '..', 'lib', 'alert.model'));


describe('Alert', () => {

  describe('Statics', () => {

    it('should expose model name as constant', () => {
      expect(Alert.MODEL_NAME).to.exist;
      expect(Alert.MODEL_NAME).to.be.equal('Alert');
    });

  });

});
