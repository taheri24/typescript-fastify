import { FastifyInstance } from "fastify";
import RolePlugin from './plugins/role';
import UserPlugin from "./plugins/user";
 
export default function ApiPlugin(fastify:FastifyInstance,opts,next){
    fastify.register(RolePlugin,{  prefix:'/roles'})
    fastify.register(UserPlugin,{  prefix:'/users'})

    next();
}