import { FastifyInstance, Plugin } from "fastify";

export interface BaseTemplateDefinition {
    hooks?: any;
    model?: any;
    inject(fastify: FastifyInstance, model, hooks)
}

export interface ITemplatedModel {
    template: BaseTemplateDefinition;
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
function server(mod: ITemplatedModel, noData?: unknown): TemplatedServer<any> & Plugin<any, any, any, any>;
function server<T extends BaseTemplateDefinition>(template: T,
    model?: T['model']
): TemplatedServer<T> & Plugin<any, any, any, any> {
    if (!model) {
        const moduleInfo = template as any as ITemplatedModel;
        if (moduleInfo && moduleInfo.template) {
            return server(moduleInfo.template as any, moduleInfo as any);
        }
    }
    const hooks: T['hooks'] = {}
    const templatedResult: TemplatedServer<T> = {
        hook(key, callback) {
            hooks[key] = callback;
            return templatedResult;
        },
        plugin(fastify: FastifyInstance, opts, next) {
             (template as T).inject(fastify, model, hooks);
            next();
        }
    };
    return Object.assign(templatedResult.plugin, templatedResult);
}

export default server as any as {
    (mod: ITemplatedModel ): TemplatedServer<any> & Plugin<any, any, any, any>,
    <T extends BaseTemplateDefinition>(template: T,
        model?: T['model']
    ): TemplatedServer<T> & Plugin<any, any, any, any>
};