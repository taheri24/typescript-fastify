// Require the framework and instantiate it
//const fastify = require()({ logger: true })
import * as fastify from 'fastify';
import { createConnection, Connection } from 'typeorm';
import { User } from './entity/User';
let defaultConn: Connection;
const app = fastify({ logger: true });
// Declare a route
app.get('/', async (request, reply) => {
  const userRepo = defaultConn.getRepository(User);

  return userRepo.findOne(1);
});

// Run the server!
const start = async () => {
  defaultConn = await createConnection();

  try {
    await app.listen(3100)
    console.log(`server listening on ${JSON.stringify(app.server.address())}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()