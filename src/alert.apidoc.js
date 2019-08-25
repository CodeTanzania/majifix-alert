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

/**
 * @apiDefine Alert
 * @apiSuccess {String} _id Unique status identifier
 * @apiSuccess {String[]} [jurisdictions = undefined] jurisdictions under which
 * an alert is applicable.
 * @apiSuccess {String} subject Human readable subject of the alert
 * e.g Water Schedule
 * @apiSuccess {String} message Human readable message of the alert
 * e.g There will be no water in your neighbourhood
 * @apiSuccess {String[]} [methods = ['SMS'] ] Methods to be used to send an
 * alert e.g SMS, EMAIL etc
 * @apiSuccess {Date} createdAt Date when status was created
 * @apiSuccess {Date} updatedAt Date when status was last updated
 *
 */

/**
 * @apiDefine Alerts
 * @apiSuccess {Object[]} data List of alerts
 * @apiSuccess {String} data._id Unique status identifier
 * @apiSuccess {String[]} [jurisdictions = undefined] jurisdictions under which
 * an alert is applicable.
 * @apiSuccess {String} data.subject Human readable subject of the alert
 * e.g Water Schedule
 * @apiSuccess {String} data.message Human readable message of the alert
 * e.g There will be no water in your neighbourhood
 * @apiSuccess {String[]} [data.methods = ['SMS'] ] Methods to be used to send
 * an alert e.g SMS, EMAIL etc
 * @apiSuccess {Date} data.createdAt Date when status was created
 * @apiSuccess {Date} data.updatedAt Date when status was last updated
 * @apiSuccess {Number} total Total number of status
 * @apiSuccess {Number} size Number of status returned
 * @apiSuccess {Number} limit Query limit used
 * @apiSuccess {Number} skip Query skip/offset used
 * @apiSuccess {Number} page Page number
 * @apiSuccess {Number} pages Total number of pages
 * @apiSuccess {Date} lastModified Date and time at which latest status
 * was last modified
 *
 */

/**
 * @apiDefine AlertSuccessResponse
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "_id": "5aeed5f37e422f2743b97eb0",
 *    jurisdiction: [{
 *      _id: "5af2fe3ea937a3238bd8e64b",
 *      code: "66514685",
 *      name: "Gana"
 *    }],
 *    "subject": "Water Schedule",
 *    "message": "There will be no water in your neighbourhood",
 *    "methods": ["SMS"],
 *    "createdAt": "2018-05-06T10:16:19.230Z",
 *    "updatedAt": "2018-05-06T10:16:19.230Z",
 *  }
 */

/**
 * @apiDefine AlertsSuccessResponse
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "data": [
 *    {
 *      "_id": "5aeed5f37e422f2743b97eb0",
 *      jurisdiction: [{
 *        _id: "5af2fe3ea937a3238bd8e64b",
 *        code: "66514685",
 *        name: "Gana"
 *      }],
 *      "subject": "Water Schedule",
 *      "message": "There will be no water in your neighbourhood",
 *      "methods": ["SMS"],
 *      "createdAt": "2018-05-06T10:16:19.230Z",
 *      "updatedAt": "2018-05-06T10:16:19.230Z",
 *     }
 *    ],
 *   "total": 10,
 *   "size": 2,
 *   "limit": 2,
 *   "skip": 0,
 *   "page": 1,
 *   "pages": 5,
 *   "lastModified": "2018-05-06T10:19:04.910Z"
 * }
 */

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
