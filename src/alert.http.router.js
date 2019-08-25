import { getString } from '@lykmapipo/env';
import {
  getFor,
  schemaFor,
  downloadFor,
  getByIdFor,
  postFor,
  patchFor,
  putFor,
  deleteFor,
  Router,
} from '@lykmapipo/express-rest-actions';
import Alert from './alert.model';

/* constants */
const API_VERSION = getString('API_VERSION', '1.0.0');
const PATH_SINGLE = '/alerts/:id';
const PATH_LIST = '/alerts';
const PATH_EXPORT = '/alerts/export';
const PATH_SCHEMA = '/alerts/schema/';
const PATH_JURISDICTION = '/jurisdictions/:jurisdiction/alerts';

/**
 * @name AlertHttpRouter
 * @namespace AlertHttpRouter
 *
 * @description A representation of an alert which notify citizens in
 * case of service disruption such as lack of water, network maintenance etc.
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since  0.1.0
 * @version 1.0.0
 * @public
 */
const router = new Router({
  version: API_VERSION,
});

/**
 * @name GetAlerts
 * @memberof AlertHttpRouter
 * @description Returns a list of alerts
 */
router.get(
  PATH_LIST,
  getFor({
    get: (options, done) => Alert.get(options, done),
  })
);

/**
 * @name GetAlertSchema
 * @memberof AlertHttpRouter
 * @description Returns alert json schema definition
 */
router.get(
  PATH_SCHEMA,
  schemaFor({
    getSchema: (query, done) => {
      const jsonSchema = Alert.jsonSchema();
      return done(null, jsonSchema);
    },
  })
);

/**
 * @name ExportAlerts
 * @memberof AlertHttpRouter
 * @description Export alerts as csv
 */
router.get(
  PATH_EXPORT,
  downloadFor({
    download: (options, done) => {
      const fileName = `alerts_exports_${Date.now()}.csv`;
      const readStream = Alert.exportCsv(options);
      return done(null, { fileName, readStream });
    },
  })
);

/**
 * @name PostAlert
 * @memberof AlertHttpRouter
 * @description Create new alert
 */
router.post(
  PATH_LIST,
  postFor({
    post: (body, done) => Alert.send(body, done),
  })
);

/**
 * @name GetAlert
 * @memberof AlertHttpRouter
 * @description Get existing alert
 */
router.get(
  PATH_SINGLE,
  getByIdFor({
    getById: (options, done) => Alert.getById(options, done),
  })
);

/**
 * @name PatchAlert
 * @memberof AlertHttpRouter
 * @description Patch existing alert
 */
router.patch(
  PATH_SINGLE,
  patchFor({
    patch: (options, done) => Alert.patch(options, done),
  })
);

/**
 * @name PutAlert
 * @memberof AlertHttpRouter
 * @description Put existing alert
 */
router.put(
  PATH_SINGLE,
  putFor({
    put: (options, done) => Alert.put(options, done),
  })
);

/**
 * @name DeleteAlert
 * @memberof AlertHttpRouter
 * @description Delete existing alert
 */
router.delete(
  PATH_SINGLE,
  deleteFor({
    del: (options, done) => Alert.del(options, done),
    soft: true,
  })
);

/**
 * @name GetJurisdictionAlerts
 * @memberof AlertHttpRouter
 * @description Returns a list of alerts of specified jurisdiction
 */
router.get(
  PATH_JURISDICTION,
  getFor({
    get: (options, done) => Alert.get(options, done),
  })
);

/* expose router */
export default router;
