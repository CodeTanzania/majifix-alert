'use strict';


/**
 * @module Alert
 * @name Alert
 * @description A representation of an alert which notify citizens in
 * case of service disruption such as lack of water, network maintenance etc.
 *
 * @requires https://github.com/CodeTanzania/majifix-jurisdiction
 * @see {@link https://github.com/CodeTanzania/majifix-jurisdiction}
 *
 * @requires https://github.com/CodeTanzania/majifix-account
 * @see {@link https://github.com/CodeTanzania/majifix-account}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @author Benson Maruchu <benmaruchu@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 1.0.0
 * @public
 */


/* dependencies */
const _ = require('lodash');
const async = require('async');
const mongoose = require('mongoose');
const actions = require('mongoose-rest-actions');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
// const { Account } = require('@codetanzania/majifix-account');
const { plugin: runInBackground } = require('mongoose-kue');
const { Message } = require('@lykmapipo/postman');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const { TYPE_SMS, TYPES } = Message;


/* local constants */
const ALERT_MODEL_NAME = 'Alert';
const JURISDICTION_PATH = 'jurisdiction';
const SCHEMA_OPTIONS = ({ timestamps: true, emitIndexErrors: true });


/**
 * @name AlertSchema
 * @type {Schema}
 * @since 0.1.0
 * @version 1.0.0
 * @private
 */
const AlertSchema = new Schema({
  /**
   * @name jurisdictions
   * @description A jurisdictions under which an alert is applicable.
   *
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {string} ref - referenced collection
   * @property {boolean} exists - ensure ref exists before save
   * @property {object} autopopulate - jurisdiction population options
   * @property {boolean} index - ensure database index
   *
   * @since 0.1.0
   * @version 1.0.0
   * @instance
   */
  jurisdictions: {
    type: [ObjectId],
    ref: Jurisdiction.MODEL_NAME,
    required: true,
    exists: true,
    autopopulate: Jurisdiction.OPTION_AUTOPOPULATE,
    index: true
  },


  /**
   * @name subject
   * @description Human readable subject of the alert
   * e.g Water Schedule
   *
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {boolean} trim - force trimming
   * @property {boolean} required - mark required
   * @property {boolean} index - ensure database index
   * @property {boolean} searchable - allow for searching
   * @property {string[]}  locales - list of supported locales
   * @property {object} fake - fake data generator options
   *
   * @since 0.1.0
   * @version 1.0.0
   * @instance
   */
  subject: {
    type: String,
    trim: true,
    required: true,
    index: true,
    searchable: true,
    fake: {
      generator: 'hacker',
      type: 'noun'
    }
  },


  /**
   * @name message
   * @description Human readable message of the alert
   * e.g There will be no water in your neighbourhood
   *
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {boolean} trim - force trimming
   * @property {boolean} required - mark required
   * @property {boolean} index - ensure database index
   * @property {boolean} searchable - allow for searching
   * @property {string[]}  locales - list of supported locales
   * @property {object} fake - fake data generator options
   *
   * @since 0.1.0
   * @version 1.0.0
   * @instance
   */
  message: {
    type: String,
    trim: true,
    required: true,
    index: true,
    searchable: true,
    fake: {
      generator: 'lorem',
      type: 'sentence'
    }
  },


  /**
   * @name methods
   * @description Methods to be used to send an alert
   * e.g SMS, EMAIL etc
   *
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {boolean} trim - force trimming
   * @property {boolean} required - mark required
   * @property {boolean} index - ensure database index
   * @property {boolean} searchable - allow for searching
   * @property {string[]}  locales - list of supported locales
   * @property {object} fake - fake data generator options
   *
   * @since 0.1.0
   * @version 1.0.0
   * @instance
   */
  methods: {
    type: [String],
    required: true,
    enum: TYPES,
    default: [TYPE_SMS],
    index: true,
    searchable: true,
    fake: true
  }

}, SCHEMA_OPTIONS);


/*
 *------------------------------------------------------------------------------
 * Hook
 *------------------------------------------------------------------------------
 */


AlertSchema.pre('validate', function (next) {

  next();

});


/*
 *------------------------------------------------------------------------------
 * Instance
 *------------------------------------------------------------------------------
 */



/**
 * @name beforeDelete
 * @function beforeDelete
 * @description pre delete alert logics
 * @param {function} done callback to invoke on success or error
 *
 * @since 0.1.0
 * @version 1.0.0
 * @instance
 */
AlertSchema.methods.beforeDelete = function beforeDelete(done) {

  //restrict delete if

  async.parallel({

    //1...there are message reference alert
    messages: function checkMessageDependency(next) {

      //check message dependency
      Message
        .count({ bulk: this._id.toString() }, function (error, count) {

          //warning can not delete
          if (count && count > 0) {
            const errorMessage =
              `Fail to Delete. ${count} messages depend on it`;
            error = new Error(errorMessage);
          }

          //ensure error status
          if (error) {
            error.status = 400;
          }

          //return
          next(error, this);

        }.bind(this));

    }.bind(this)

  }, function (error) {
    done(error, this);
  });

};


/**
 * @name beforePost
 * @function beforePost
 * @description pre save alert logics
 * @param {function} done callback to invoke on success or error
 *
 * @since 0.1.0
 * @version 1.0.0
 * @instance
 */
AlertSchema.methods.beforePost = function beforePost(done) {

  //ensure jurisdiction is pre loaded before post(save)
  const jurisdictions = _.map(this.jurisdictions, function (jurisdiction) {
    return _.get(jurisdiction, '_id', jurisdiction);
  });

  //prefetch existing jurisdictions
  if (jurisdictions) {

    Jurisdiction
      .find({ jurisdiction: { $in: jurisdictions } })
      .exec(function (error, jurisdictions) {

        //assign existing jurisdiction
        if (jurisdictions) {
          this.jurisdictions = jurisdictions;
        }

        //return
        done(error, this);

      }.bind(this));

  }

  //continue
  else {
    done();
  }

};


/**
 * @name afterPost
 * @function afterPost
 * @description post save alert logics
 * @param  {function} done callback to invoke on success or error
 * @since 0.1.0
 * @version 1.0.0
 * @instance
 */
AlertSchema.methods.afterPost = function afterPost(done) {

  //ensure jurisdictions are populated after post(save)
  const population =
    _.merge({}, { path: JURISDICTION_PATH }, Jurisdiction.OPTION_AUTOPOPULATE);
  this.populate(population, done);

};


/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */


/**
 * @name send
 * @function send
 * @description send alert
 * @param {function} done a callback to invoke on success or failure
 * @return {Alert} default status
 * @since 0.1.0
 * @version 1.0.0
 * @static
 */
AlertSchema.statics.send = function send(done) {

  //reference status
  // const Alert = this;

  //TODO find accounts in jurisdiction
  //TODO stream accounts
  //queue the message
  done();

};


/* expose static constants */
AlertSchema.statics.MODEL_NAME = ALERT_MODEL_NAME;


/*
 *------------------------------------------------------------------------------
 * Plugins
 *------------------------------------------------------------------------------
 */


/* use mongoose rest actions*/
AlertSchema.plugin(actions);
AlertSchema.plugin(runInBackground);


/* export status model */
module.exports = mongoose.model(ALERT_MODEL_NAME, AlertSchema);
