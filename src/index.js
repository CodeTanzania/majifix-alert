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
import { pkg } from '@lykmapipo/common';
import Alert from './alert.model';
import router from './http.router';
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

export { apiVersion, info, Alert, router };
