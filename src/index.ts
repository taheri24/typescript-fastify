// Require the framework and instantiate it
//const fastify = require()({ logger: true })
import * as fastify from 'fastify';
import { createDefaultConnection, defaultConn } from './core/db';
const app = fastify({ logger: false });
console.log('Try to Starting');
import ApiPlugin from './api';
// Run the server!
const start = async () => {
  console.log('Try to connect');
  await createDefaultConnection();
  console.log('Registering API Routers');
  app.register(ApiPlugin,{prefix:'/api/v0'});
  try {
    console.log('try to start server');
    await app.listen(3100)
    console.log(`server listening on ${JSON.stringify(app.server.address())}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()
