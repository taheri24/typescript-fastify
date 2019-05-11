import { FastifyInstance } from "fastify";
import RolePlugin from './plugins/roles';
import UserPlugin from "./plugins/users";
 
export default function ApiPlugin(fastify:FastifyInstance,opts,next){
    // register business routes
    fastify.register(RolePlugin,{  prefix:'/roles'})
    fastify.register(UserPlugin,{  prefix:'/users'})
    //  call next   
    next();
}