import { defaultConn } from "./db";
import { FastifyInstance } from "fastify";
import { TemplateDefinition } from "templated-module";
interface Hooks {
    afterSingleEntity<T>(v: T): Promise<T>;
}
interface Model{
    entityClass:{ new(...args:any[]): any }
}
const TemplateForCRUD: TemplateDefinition<Model, Hooks> = {
    inject(fastify: FastifyInstance, model, hooks: Hooks) {
        const repo = defaultConn.getRepository(model.entity);
        const relations = repo.metadata.relations.map(r => r.propertyPath);
        fastify.get('/:id', async req => {
            const { id } = req.params;
            let result = await repo.findOne(id, { relations });
            if (hooks.afterSingleEntity instanceof Function)
                result = await hooks.afterSingleEntity(result);
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
    }
}
export default TemplateForCRUD;
