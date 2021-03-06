import { FastifyInstance, Plugin } from "fastify";
import RolePlugin from './plugins/roles';
import UserPlugin from "./plugins/users";
import { RestPlugin } from "../typings";

const ApiPlugin: RestPlugin = (fastify, opts, next) => {
    // register business routes
    fastify.register(RolePlugin, { prefix: '/roles' })
    fastify.register(UserPlugin, { prefix: '/users' })
    //  call next
    next();
}
export = ApiPlugin;
