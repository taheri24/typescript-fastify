import { Connection, createConnection } from "typeorm";

export let defaultConn: Connection;
export async function  createDefaultConnection(){
    defaultConn=await createConnection();
}