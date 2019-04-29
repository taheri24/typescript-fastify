import { FastifyInstance } from "fastify";
import { Connection } from "typeorm";
import * as fastifyStatic from 'fastify-static';
import { join } from "path";
import { readFileSync } from "fs";

export default function OrmPanelPlugin(fastify: FastifyInstance, opts, next) {
    const connection = opts.connection as Connection;
    fastify.register(fastifyStatic, { root: join(__dirname, 'public'), prefix: '/public' })
    fastify.get('/', async (req, reply) => {
        reply.type('text/html')
            .send(readFileSync(join(__dirname, 'frontend', 'index.html'), { encoding: 'utf-8' }))
    });
    fastify.get('/api/db', async () => {
        return connection.entityMetadatas.map(m => ({
            name: m.name,
            columns: m.columns.map(c => c.propertyName)
        }));


    })
    next();
}