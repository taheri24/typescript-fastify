// Require the framework and instantiate it
//const fastify = require()({ logger: true })
import * as fastify from 'fastify';
import { createDefaultConnection, defaultConn } from './core/db';
import ApiPlugin from './api';
const app = fastify({ logger: false });
// Declare a route
app.register(ApiPlugin,{prefix:'/api/v0'})  
// Run the server! 
const start = async () => {
  await createDefaultConnection(); 
  try {
    await app.listen(3100)
    console.log(`server listening on ${JSON.stringify(app.server.address())}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()