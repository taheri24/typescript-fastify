import { FastifyInstance, Plugin } from "fastify";

export interface BaseTemplateDefinition {
    hooks?: any;
    model?: any;
    inject(fastify: FastifyInstance, model, hooks)
}
export interface TemplateDefinition<M, THooks> {
    hooks?: THooks;
    model?: M;
    inject(fastify: FastifyInstance, model, hooks);
}


interface TemplatedServer<T extends BaseTemplateDefinition> {
    hook<K extends keyof T['hooks']>(key: K, callback: T['hooks'][K]): this;
    plugin: any;
}
export default function templatedServer<T extends BaseTemplateDefinition>(template: T,
    model: T['model']
): TemplatedServer<T> & Plugin<any, any, any, any> {
    const hooks: T['hooks'] = {}
    const templatedResult: TemplatedServer<T> = {
        hook(key, callback) {
            hooks[key] = callback;
            return templatedResult;
        },
        plugin(fastify: FastifyInstance, opts, next) {
            template.inject(fastify, model, hooks);
            next();
        }
    };
    return Object.assign(templatedResult.plugin, templatedResult);
} 
