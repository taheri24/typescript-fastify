import { User } from "../models/user.entity";
import * as templatedModule from "../core";
export default templatedModule.server(
    templatedModule.CRUD.initialize(User, {
        beforeUpdate(user) {
 
        }
    })
);