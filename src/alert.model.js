import _ from 'lodash';
import { parallel, waterfall } from 'async';
import { sortedUniq, idOf, mergeObjects } from '@lykmapipo/common';
import { getString } from '@lykmapipo/env';
import { toE164 } from '@lykmapipo/phone';
import {
  createSchema,
  model,
  ObjectId,
  Mixed,
} from '@lykmapipo/mongoose-common';
import actions from 'mongoose-rest-actions';
import exportable from '@lykmapipo/mongoose-exportable';
import { plugin as runInBackground } from 'mongoose-kue';
import { Message, SMS } from '@lykmapipo/postman';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import {
  POPULATION_MAX_DEPTH,
  MODEL_NAME_ALERT,
  COLLECTION_NAME_ALERT,
  checkDependenciesFor,
} from '@codetanzania/majifix-common';

/* constants */
const { TYPE_SMS, TYPES } = Message;
const OPTION_SELECT = { jurisdiction: 1, subject: 1, receivers: 1, methods: 1 };
const OPTION_AUTOPOPULATE = {
  select: OPTION_SELECT,
  maxDepth: POPULATION_MAX_DEPTH,
};
const SCHEMA_OPTIONS = { collection: COLLECTION_NAME_ALERT };
const DEFAULT_SMS_SENDER_ID = getString('DEFAULT_SMS_SENDER_ID');
const RECEIVER_REPORTERS = 'Reporters';
const RECEIVER_CUSTOMERS = 'Customers';
const RECEIVER_SUBSCRIBERS = 'Subscribers';
const RECEIVER_EMPLOYEES = 'Employees';
const RECEIVERS = [
  RECEIVER_REPORTERS,
  RECEIVER_CUSTOMERS,
  RECEIVER_SUBSCRIBERS,
  RECEIVER_EMPLOYEES,
];

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
 * @since 1.0.0
 * @version 0.1.0
 * @public
 */
const AlertSchema = createSchema(
  {
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
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     */
    jurisdictions: {
      type: [ObjectId],
      ref: Jurisdiction.MODEL_NAME,
      default: undefined,
      required: true,
      exists: { refresh: true, select: Jurisdiction.OPTION_SELECT },
      autopopulate: Jurisdiction.OPTION_AUTOPOPULATE,
      index: true,
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
     * @property {boolean} taggable - allow field use for tagging
     * @property {boolean} exportable - allow field to be exported
     * @property {boolean} searchable - allow for searching
     * @property {object} fake - fake data generator options
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     */
    subject: {
      type: String,
      trim: true,
      required: true,
      index: true,
      taggable: true,
      exportable: true,
      searchable: true,
      fake: {
        generator: 'hacker',
        type: 'noun',
      },
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
     * @property {boolean} exportable - allow field to be exported
     * @property {boolean} searchable - allow for searching
     * @property {object} fake - fake data generator options
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     */
    message: {
      type: String,
      trim: true,
      required: true,
      index: true,
      exportable: true,
      searchable: true,
      fake: {
        generator: 'lorem',
        type: 'sentence',
      },
    },

    /**
     * @name methods
     * @description Methods to be used to send an alert
     * e.g SMS, EMAIL etc
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} required - mark required
     * @property {string[]} enum - list of allowed methods
     * @property {string[]} default - value to set if non specified
     * @property {boolean} index - ensure database index
     * @property {boolean} taggable - allow field use for tagging
     * @property {boolean} exportable - allow field to be exported
     * @property {boolean} searchable - allow for searching
     * @property {object} fake - fake data generator options
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     */
    methods: {
      type: [String],
      required: true,
      enum: TYPES,
      default: [TYPE_SMS],
      index: true,
      taggable: true,
      exportable: true,
      searchable: true,
      fake: true,
    },

    /**
     * @name receivers
     * @description Targeted audience of the alert e.g Reporters, Employee etc.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} required - mark required
     * @property {string[]} enum - list of allowed receivers
     * @property {string[]} default - value to set if non specified
     * @property {boolean} index - ensure database index
     * @property {boolean} taggable - allow field use for tagging
     * @property {boolean} exportable - allow field to be exported
     * @property {boolean} searchable - allow for searching
     * @property {object} fake - fake data generator options
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     */
    receivers: {
      type: [String],
      default: undefined,
      required: true,
      enum: RECEIVERS,
      index: true,
      taggable: true,
      exportable: true,
      searchable: true,
      fake: true,
    },

    /**
     * @name statistics
     * @description General summary sent, delivery and failed alert messages
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {object} default - value to set if non specified
     * @property {object} fake - fake data generator options
     *
     * @since 1.0.0
     * @version 0.1.0
     * @instance
     */
    statistics: {
      type: Mixed,
      default: {},
      fake: true,
    },
  },
  SCHEMA_OPTIONS,
  actions,
  exportable,
  runInBackground
);

/*
 *------------------------------------------------------------------------------
 * Hook
 *------------------------------------------------------------------------------
 */

/**
 * @name validate
 * @description alert schema pre validation hook
 * @param {Function} done callback to invoke on success or error
 * @since 1.0.0
 * @version 0.1.0
 * @private
 */
AlertSchema.pre('validate', function preValidate(next) {
  return this.preValidate(next);
});

/*
 *------------------------------------------------------------------------------
 * Instance
 *------------------------------------------------------------------------------
 */

/**
 * @name preValidate
 * @description alert schema pre validation hook logic
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid instance or error
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 */
AlertSchema.methods.preValidate = function preValidate(done) {
  // ensure jurisdictions, receivers & methods

  // ensure statistics
  if (_.isEmpty(this.statistics) && !_.isEmpty(this.methods)) {
    const statistics = {};
    _.forEach(this.methods, method => {
      statistics[method] = { sent: 0, delivered: 0, failed: 0 };
    });
    this.statistics = statistics;
  }

  // continue
  return done(null, this);
};

/**
 * @name beforeDelete
 * @function beforeDelete
 * @description pre delete alert logics
 * @param  {Function} done callback to invoke on success or error
 * @returns {object|Error} dependence free instance or error
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 */
AlertSchema.methods.beforeDelete = function beforeDelete(done) {
  // restrict delete if

  // collect dependencies model name
  const dependencies = [Message.MODEL_NAME];

  // path to check
  const path = 'bulk';

  // do check dependencies
  return checkDependenciesFor(this, { path, dependencies }, done);
};

/**
 * @name send
 * @function send
 * @description send alert
 * @param {Function} done a callback to invoke on success or failure
 * @returns {Alert} default status
 * @since 1.0.0
 * @version 0.1.0
 * @instance
 */
AlertSchema.methods.send = function send(done) {
  // prepare jurisdiction
  const jurisdictions = _.map([].concat(this.jurisdictions), jurisdiction =>
    _.get(jurisdiction, '_id', jurisdiction)
  );

  // prepare receivers
  const receivers = sortedUniq(this.receivers);

  // get models ref
  const Party = model('Party');
  const ServiceRequest = model('ServiceRequest');
  const Account = model('Account');

  // prepare jurisdiction criteria
  const criteria = { jurisdiction: { $in: jurisdictions } };

  // prepare distinct receivers
  const works = {};
  _.forEach(receivers, receiver => {
    // query employees phones
    if (Party && receiver === RECEIVER_EMPLOYEES) {
      const partyCriteria = { $or: [criteria, { jurisdiction: null }] };
      works.parties = next => {
        Party.getPhones(partyCriteria, next);
      };
    }

    // query account phones
    if (Account && receiver === RECEIVER_CUSTOMERS) {
      const accountCriteria = mergeObjects(criteria);
      works.accounts = next => {
        Account.getPhones(accountCriteria, next);
      };
    }

    // query reporters phones
    if (ServiceRequest && receiver === RECEIVER_REPORTERS) {
      const requestCriteria = mergeObjects(criteria);
      works.reporters = next => {
        ServiceRequest.getPhones(requestCriteria, next);
      };
    }
  });

  // query phones
  return parallel(works, (error, results) => {
    // back off on error
    if (error) {
      return done(error);
    }

    // collect phone numbers
    let phones = [];

    // handle results
    phones = []
      .concat(results.parties)
      .concat(results.accounts)
      .concat(results.reporters);
    phones = _.uniq(_.compact(phones));

    // update statistics
    let statistics = {};
    if (!_.isEmpty(phones)) {
      statistics = _.merge({}, this.statistics);
      statistics[TYPE_SMS] = _.merge({}, statistics[TYPE_SMS], {
        sent: phones.length,
      });
    }

    // queue(send) sms
    _.forEach(phones, phone => {
      const payload = {
        sender: DEFAULT_SMS_SENDER_ID,
        to: toE164(phone),
        subject: this.subject,
        body: this.message,
        bulk: idOf(this).toString(),
      };
      const sms = new SMS(payload);
      sms.queue();
    });

    // update alert
    return this.put({ statistics }, done);
  });
};

/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */

/* static constants */
AlertSchema.statics.MODEL_NAME = MODEL_NAME_ALERT;
AlertSchema.statics.RECEIVERS = RECEIVERS;
AlertSchema.statics.OPTION_SELECT = OPTION_SELECT;
AlertSchema.statics.OPTION_AUTOPOPULATE = OPTION_AUTOPOPULATE;

/**
 * @name send
 * @function send
 * @description Save and send given alert
 * @param {object} options valid alert definition
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} sent alert or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 1.0.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const alert = { ... };
 * Alert.send(alert, (error, alert) => { ... });
 *
 */
AlertSchema.statics.send = function send(options, done) {
  // refs
  const Alert = model(MODEL_NAME_ALERT);

  const saveAlert = next => Alert.post(options, next);
  const sendAlert = (alert, next) => alert.send(next);

  // save, send and return
  return waterfall([saveAlert, sendAlert], done);
};

/* export status model */
export default model(MODEL_NAME_ALERT, AlertSchema);
