'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');


/* declarations */
const Alert =
  require(path.join(__dirname, '..', '..', 'lib', 'alert.model'));


describe('Alert', function () {

  describe('Statics', function () {

    it('should expose model name as constant', function () {
      expect(Alert.MODEL_NAME).to.exist;
      expect(Alert.MODEL_NAME).to.be.equal('Alert');
    });

  });

});
