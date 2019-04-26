import { defaultConn } from "./db";
import { FastifyInstance } from "fastify";

export default function FastPluginForCRUD<T>(classType: any){
    return function(fastify:FastifyInstance,opts,next){
        const repo=defaultConn.getRepository(classType);
        fastify.get('/:id',async req=>{
            const {id}=req.params;
            const result=await repo.findOne(id,{});
            return result || {message:'not found'};
        })
        next();
    }
}