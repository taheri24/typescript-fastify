// Require the framework and instantiate it
//const fastify = require()({ logger: true })
import * as fastify from 'fastify';
const app=fastify({logger:true});
// Declare a route
app.get('/', async (request, reply) => {
     return { hello: 'DDD-taheri' }
});

// Run the server!
const start = async () => {
    console.log('Starting Server With ProcessId>>',process.pid);
    try {
        await app.listen(3000)
    console.log(`server listening on ${JSON.stringify(app.server.address())}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()