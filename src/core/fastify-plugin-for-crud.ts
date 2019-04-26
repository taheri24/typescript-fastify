import { defaultConn } from "./db";
import { FastifyInstance } from "fastify";

export default function FastPluginForCRUD<T>(classType: any){
           
    return function(fastify:FastifyInstance,opts,next){
        const repo=defaultConn.getRepository(classType);
        const relations=repo.metadata.relations.map(r=>r.propertyPath)
             
        fastify.get('/:id',async req=>{
            const {id}=req.params;
            const result=await repo.findOne(id,{relations});
            return result || {message:'not found'};
        })
        fastify.post('/',async req=>{
            return defaultConn.manager.save(classType,req.body);
        })
         
        next();
    }
}