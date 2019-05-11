import { defaultConn } from "./db";
import { FastifyInstance } from "fastify";
import { TemplateDefinition } from "core";
import { ITemplatedModel } from "./templated-server";
import { Repository } from "typeorm";

interface Hooks {
    afterSingleEntity<T>(v: T): Promise<T>;
}
interface Model<T> {
    entityClass: { new(...args: any[]): T }
    beforeUpdate?(entity: T);
}
function initialize<T>(entityClass: { new(...args: any[]): T }, model?: Partial<Model<T>>): ITemplatedModel & Model<T> {
    return {
        template: TemplateForCRUD,
        entityClass,
        ...(model || {})
    } as any;
}
function checkDetails<T>(repo: Repository<T>, oldEntity: T, newEntity: T): string {
    const relations = repo.metadata && repo.metadata.relations;
    if (relations instanceof Array) {
        for (const relation of relations) {
            if (!oldEntity) {
                const freshItems = newEntity[relation.propertyName] as any[];
                if (freshItems instanceof Array && freshItems.some(item => repo.getId(item)))
                    return `invalid-${relation.propertyName}-append-mode`;
            }
            else {
                const oldArray = oldEntity[relation.propertyName] as any[];
                const newArray = newEntity[relation.propertyName] as any[];
                if (oldArray instanceof Array && newArray instanceof Array) {
                    const oldItemById = Object.assign({}, ...oldArray.map(item => ({ [repo.getId(item)]: item })));
                    for (const item of newArray) {
                        const id = repo.getId(item);
                        if (id) {
                            if (!oldItemById[id]) return `invalid-${relation.propertyName}-${id}`;
                        }
                    }
                }
            }
        }
    }
    return null;
}
async function fullSave<T>(repo: Repository<T>, entity: T,oldEntity?:T) {
    const storedEntity = await repo.save(entity, { reload: true });
    for (const relation of repo.metadata.relations) {
        const subRepo = defaultConn.getRepository(relation.type);
        const items = entity[relation.propertyName] as any[];
        for (const item of items) {
            Object.assign(item, { [relation.inverseSidePropertyPath]: storedEntity });

        }
        const storedArray = await subRepo.save(items, { reload: true    });
        Object.assign(storedEntity, { [relation.propertyName]: storedArray });
    }
    return storedEntity;
}
const TemplateForCRUD: TemplateDefinition<Model<any>, Hooks> & { initialize: typeof initialize } = {
    inject(fastify: FastifyInstance, model, hooks: Hooks) {
        const repo = defaultConn.getRepository(model.entityClass);
        const relations = repo.metadata.relations.map(r => r.propertyPath);
        fastify.get('/:id', async (req, res) => {
            const { id } = req.params;
            let result = await repo.findOne(id, { relations });
            if (!result) {
                res.code(404);
            }
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
        fastify.put('/:id', async (req, res) => {
            const { id } = req.params;
            const entity = await repo.findOne(id);
            if (!entity) return { message: 'not found' };

            const newEntity = { ...entity, ...req.body };
            const errorCode = checkDetails(repo, entity, newEntity);
            if (errorCode) {
                res.status(400);
                return { message: errorCode };
            }

            return fullSave(repo, newEntity);;
        });
        fastify.post('/', async (req, res) => {
            const entity = repo.create();
            Object.assign(entity, req.body);
            const errorCode = checkDetails(repo, null, entity);
            if (errorCode) {
                res.status(400);
                return { message: errorCode };
            }
            const storedEntity = await fullSave(repo, entity);

            return { id: repo.getId(storedEntity) };
        });
    }, initialize
}

export default TemplateForCRUD;
