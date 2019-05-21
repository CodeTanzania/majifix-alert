'use strict';


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


/* dependencies */
const path = require('path');
const _ = require('lodash');
const { app, mount } = require('@lykmapipo/express-common');


/* declarations */
const pkg = require(path.join(__dirname, 'package.json'));
const fields = [
  'name',
  'description',
  'version',
  'license',
  'homepage',
  'repository',
  'bugs',
  'sandbox',
  'contributors'
];


/* extract information from package.json */
const info = _.merge({}, _.pick(pkg, fields));


/* import models */
const Alert =
  require(path.join(__dirname, 'lib', 'alert.model'));


/* import routers*/
const router =
  require(path.join(__dirname, 'lib', 'http.router'));


/* export package(module) info */
exports.info = info;


/* export alert model */
exports.Alert = Alert;


/* export alert router */
exports.router = exports.alertRouter = router;


/* export router api version */
exports.apiVersion = router.version;


/* export app */
Object.defineProperty(exports, 'app', {
  get() {

    //TODO bind oauth middlewares authenticate, token, authorize

    /* bind alert router */
    mount(router);
    return app;
  }

});
