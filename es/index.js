import { pkg } from '@lykmapipo/common';
import _ from 'lodash';
import async from 'async';
import mongoose from 'mongoose';
import { getString } from '@lykmapipo/env';
import actions from 'mongoose-rest-actions';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { models } from '@codetanzania/majifix-common';
import { plugin } from 'mongoose-kue';
import { Message, SMS } from '@lykmapipo/postman';
import { Router } from '@lykmapipo/express-common';

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

const { Schema } = mongoose;
const { ObjectId, Mixed } = Schema.Types;
const { TYPE_SMS, TYPES } = Message;
const { getModel } = models;

/* constants */
const DEFAULT_SMS_SENDER_ID = getString('DEFAULT_SMS_SENDER_ID');
const ALERT_MODEL_NAME = 'Alert';
const SCHEMA_OPTIONS = { timestamps: true, emitIndexErrors: true };
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
 * @name AlertSchema
 * @type {Schema}
 * @since 0.1.0
 * @version 1.0.0
 * @private
 */
const AlertSchema = new Schema(
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
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    jurisdictions: {
      type: [ObjectId],
      ref: Jurisdiction.MODEL_NAME,
      default: undefined,
      required: true,
      exists: { refresh: true },
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
     * @property {boolean} searchable - allow for searching
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
     * @property {boolean} searchable - allow for searching
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
     * @property {boolean} searchable - allow for searching
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
     * @property {boolean} searchable - allow for searching
     * @property {object} fake - fake data generator options
     *
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    receivers: {
      type: [String],
      default: undefined,
      required: true,
      enum: RECEIVERS,
      index: true,
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
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    statistics: {
      type: Mixed,
      default: {},
      fake: true,
    },
  },
  SCHEMA_OPTIONS
);

/*
 *------------------------------------------------------------------------------
 * Hook
 *------------------------------------------------------------------------------
 */

AlertSchema.pre('validate', function preValidate(next) {
  // ensure jurisdictions, receivers & methods

  // ensure statistics
  if (_.isEmpty(this.statistics) && !_.isEmpty(this.methods)) {
    const statistics = {};
    _.forEach(this.methods, function cb(method) {
      statistics[method] = { sent: 0, delivered: 0, failed: 0 };
    });
    this.statistics = statistics;
  }

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
  // restrict delete if

  async.parallel(
    {
      // 1...there are message reference alert
      messages: function checkMessageDependency(next) {
        // check message dependency
        Message.count(
          { bulk: this._id.toString() }, // eslint-disable-line no-underscore-dangle
          function cb(error, count) {
            let cbError = error;
            // warning can not delete
            if (count && count > 0) {
              const errorMessage = `Fail to Delete. ${count} messages depend on it`;
              cbError = new Error(errorMessage);
            }

            // ensure error status
            if (cbError) {
              cbError.status = 400;
            }

            // return
            next(cbError, this);
          }.bind(this)
        );
      }.bind(this),
    },
    function cb(error) {
      done(error, this);
    }
  );
};

/**
 * @name send
 * @function send
 * @description send alert
 * @param {function} done a callback to invoke on success or failure
 * @return {Alert} default status
 * @since 0.1.0
 * @version 1.0.0
 * @instance
 */
AlertSchema.methods.send = function send(done) {
  // TODO handle email

  // prepare jurisdiction
  const jurisdictions = _.map([].concat(this.jurisdictions), function cb(
    jurisdiction
  ) {
    return _.get(jurisdiction, '_id', jurisdiction);
  });

  // prepare receivers
  const receivers = _.uniq(_.compact([].concat(this.receivers)));

  // get models
  const Party = getModel('Party');
  const ServiceRequest = getModel('ServiceRequest');
  const Account = getModel('Account');

  // prepare jurisdiction criteria
  const criteria = { jurisdiction: { $in: jurisdictions } };

  // prepare distinct receivers
  const works = {};
  _.forEach(receivers, function cb(receiver) {
    // query employees phones
    if (Party && receiver === RECEIVER_EMPLOYEES) {
      const _criteria = { $or: [criteria, { jurisdiction: null }] }; // eslint-disable-line no-underscore-dangle
      works.parties = function getPartiesPhones(next) {
        Party.getPhones(_criteria, next);
      };
    }

    // query account phones
    if (Account && receiver === RECEIVER_CUSTOMERS) {
      const _criteria = _.merge({}, criteria); // eslint-disable-line no-underscore-dangle
      works.accounts = function getAccountsPhones(next) {
        Account.getPhones(_criteria, next);
      };
    }

    // query reporters phones
    if (ServiceRequest && receiver === RECEIVER_REPORTERS) {
      const _criteria = _.merge({}, criteria); // eslint-disable-line no-underscore-dangle
      works.reporters = function getReportersPhones(next) {
        ServiceRequest.getPhones(_criteria, next);
      };
    }
  });

  // query phones
  async.parallel(
    works,
    function onGetPhones(error, results) {
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

      // TODO format phones e164
      // queue(send) sms
      _.forEach(
        phones,
        function cb(phone) {
          const payload = {
            sender: DEFAULT_SMS_SENDER_ID,
            to: phone,
            subject: this.subject,
            body: this.message,
            bulk: this._id.toString(), // eslint-disable-line no-underscore-dangle
          };
          const sms = new SMS(payload);
          sms.queue();
        }.bind(this)
      );

      // update alert
      return this.put({ statistics }, done);
    }.bind(this)
  );
};

/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */

/* expose static constants */
AlertSchema.statics.MODEL_NAME = ALERT_MODEL_NAME;
AlertSchema.statics.RECEIVERS = RECEIVERS;

// WIP
AlertSchema.statics.send = function send(alert, done) {
  // refs
  const Alert = this;

  async.waterfall(
    [
      function saveAlert(next) {
        Alert.post(alert, next);
      },

      function sendAlert(created, next) {
        created.send(next);
      },
    ],
    done
  );
};

/*
 *------------------------------------------------------------------------------
 * Plugins
 *------------------------------------------------------------------------------
 */

/* use mongoose rest actions */
AlertSchema.plugin(actions);
AlertSchema.plugin(plugin);

/* export status model */
var Alert = mongoose.model(ALERT_MODEL_NAME, AlertSchema);

/**
 * @apiDefine Alert  Alert
 *
 * @apiDescription A representation of an alert which notify citizens in
 * case of service disruption such as lack of water, network maintenance etc.
 *
 * @author Benson Maruchu <benmaruchu@gmail.com>
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since  0.1.0
 * @version 1.0.0
 * @public
 */

/* local constants */
const API_VERSION = getString('API_VERSION', '1.0.0');
const PATH_LIST = '/alerts';
const PATH_SINGLE = '/alerts/:id';
const PATH_JURISDICTION = '/jurisdictions/:jurisdiction/alerts';

/* declarations */
const router = new Router({
  version: API_VERSION,
});

/**
 * @api {get} /alerts List Alerts
 * @apiVersion 1.0.0
 * @apiName GetAlerts
 * @apiGroup Alert
 * @apiDescription Returns a list of alerts
 * @apiUse RequestHeaders
 * @apiUse Alerts
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse AlertsSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(PATH_LIST, function getAlerts(request, response, next) {
  // obtain request options
  const options = _.merge({}, request.mquery);

  Alert.get(options, function onGetAlerts(error, results) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(results);
    }
  });
});

/**
 * @api {post} /alerts Create New Alert
 * @apiVersion 1.0.0
 * @apiName PostAlert
 * @apiGroup Alert
 * @apiDescription Create new status
 * @apiUse RequestHeaders
 * @apiUse Alert
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse AlertSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.post(PATH_LIST, function postAlert(request, response, next) {
  // obtain request body
  const body = _.merge({}, request.body);

  Alert.send(body, function onPostAlert(error, created) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(201);
      response.json(created);
    }
  });
});

/**
 * @api {get} /alerts/:id Get Existing Alert
 * @apiVersion 1.0.0
 * @apiName GetAlert
 * @apiGroup Alert
 * @apiDescription Get existing status
 * @apiUse RequestHeaders
 * @apiUse Alert
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse AlertSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(PATH_SINGLE, function getAlert(request, response, next) {
  // obtain request options
  const options = _.merge({}, request.mquery);

  // obtain status id
  options._id = request.params.id; // eslint-disable-line no-underscore-dangle

  Alert.getById(options, function onGetAlert(error, found) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(found);
    }
  });
});

/**
 * @api {patch} /alerts/:id Patch Existing Alert
 * @apiVersion 1.0.0
 * @apiName PatchAlert
 * @apiGroup Alert
 * @apiDescription Patch existing status
 * @apiUse RequestHeaders
 * @apiUse Alert
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse AlertSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.patch(PATH_SINGLE, function patchAlert(request, response, next) {
  // obtain status id
  const { id } = request.params;

  // obtain request body
  const patches = _.merge({}, request.body);

  Alert.patch(id, patches, function onPatchAlert(error, patched) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(patched);
    }
  });
});

/**
 * @api {put} /alerts/:id Put Existing Alert
 * @apiVersion 1.0.0
 * @apiName PutAlert
 * @apiGroup Alert
 * @apiDescription Put existing status
 * @apiUse RequestHeaders
 * @apiUse Alert
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse AlertSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.put(PATH_SINGLE, function putAlert(request, response, next) {
  // obtain status id
  const { id } = request.params;

  // obtain request body
  const updates = _.merge({}, request.body);

  Alert.put(id, updates, function onPutAlert(error, updated) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(updated);
    }
  });
});

/**
 * @api {delete} /alerts/:id Delete Existing Alert
 * @apiVersion 1.0.0
 * @apiName DeleteAlert
 * @apiGroup Alert
 * @apiDescription Delete existing status
 * @apiUse RequestHeaders
 * @apiUse Alert
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse AlertSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.delete(PATH_SINGLE, function deleteAlert(request, response, next) {
  // obtain status id
  const { id } = request.params;

  Alert.del(id, function onDeleteAlert(error, deleted) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(deleted);
    }
  });
});

/**
 * @api {get} /jurisdictions/:jurisdiction/alerts List Jurisdiction Alerts
 * @apiVersion 1.0.0
 * @apiName GetJurisdictionAlerts
 * @apiGroup Alert
 * @apiDescription Returns a list of alerts of specified jurisdiction
 * @apiUse RequestHeaders
 * @apiUse Alerts
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse AlertsSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(PATH_JURISDICTION, function getAlerts(request, response, next) {
  // obtain request options
  const { jurisdiction } = request.params;
  let filter = {};
  if (jurisdiction) {
    filter = { filter: { jurisdictions: { $in: [jurisdiction] } } };
  }
  const options = _.merge({}, filter, request.mquery);

  Alert.get(options, function onGetAlerts(error, found) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(found);
    }
  });
});

/**
 * @name majifix-alert
 * @description A representation of an alert which notify citizens in
 * case of service disruption such as lack of water, network maintenance etc.
 *
 * @author Benson Maruchu <benmaruchu@gmail.com>
 * @author lally elias <lallyelias87@gmail.com>
 * @since  0.1.0
 * @version 0.1.0
 * @license MIT
 * @example
 *
 * const { app } = require('@codetanzania/majifix-alert');
 *
 * ...
 *
 * app.start();
 *
 */
/* declarations */
const info = pkg(
  'name',
  'description',
  'version',
  'license',
  'homepage',
  'repository',
  'bugs',
  'sandbox',
  'contributors'
);
// extract api version from router version
const apiVersion = router.version;

export { Alert, apiVersion, info, router };
