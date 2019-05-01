import { defaultConn } from "./db";
import { FastifyInstance } from "fastify";

export default function FastPluginForCRUD<T>(classType: any) {

    return function (fastify: FastifyInstance, opts, next) {
        const repo = defaultConn.getRepository(classType);
        const relations = repo.metadata.relations.map(r => r.propertyPath);
        fastify.get('/:id', async req => {
            const { id } = req.params;
            const result = await repo.findOne(id, { relations });
            return result || { message: 'not found' };
        });
        fastify.get('/schema', async () => {
            const { metadata } = repo;
            const columns = metadata.columns.map(c => c.propertyName);
            const { tableName } = metadata;
            return { tableName, columns };
        });
        fastify.get('/', async req => {
            const result = await repo.find();
            return result || { message: 'not found' };
        });
        fastify.delete('/:id', async req => {
            const { id } = req.params;
            const entity = await repo.findOne(id);
            entity && await repo.remove(entity);
            return entity || { message: 'not found' };
        });
        fastify.put('/:id', async req => {
            const { id } = req.params;
            const entity = await repo.findOne(id);
            
            if (!entity) return { message: 'not found' };
            const newEntity = { ...entity, ...req.body };
            await repo.save(newEntity)
            return entity;
        });
        fastify.post('/', async req => {
            const entity = repo.create();
            Object.assign(entity, req.body);
            const storedEntity = repo.save(entity);
            const id = repo.getId(storedEntity);
            return { id };
        });
        next();
    }
}