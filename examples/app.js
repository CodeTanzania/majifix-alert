/* dependencies */
const { get, mount, start } = require('@lykmapipo/express-common');
const { connect, jsonSchema } = require('@lykmapipo/mongoose-common');
const { apiVersion, info, alertRouter } = require('../lib/index');

connect(connectionError => {
  if (connectionError) {
    throw connectionError;
  }
  get('/', (request, response) => {
    response.status(200);
    response.json(info);
  });

  get(`/${apiVersion}/schemas`, (request, response) => {
    const schema = jsonSchema();
    response.status(200);
    response.json(schema);
  });

  // mount routers
  mount(alertRouter);

  /* fire the app */
  start((error, env) => {
    if (error) {
      throw error;
    }
    // eslint-disable-next-line no-console
    console.log(`visit http://0.0.0.0:${env.PORT}/${apiVersion}/alerts`);
  });
});
