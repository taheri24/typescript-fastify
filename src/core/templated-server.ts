import { FastifyInstance } from "fastify";

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



export default function templatedServer<T extends BaseTemplateDefinition>(template: T,
    model: T['model'],
    hooks?: T['hooks']) {
    return function (fastify: FastifyInstance, opts, next) {
        template.inject(fastify, model, hooks);
        next();
    }
} 
