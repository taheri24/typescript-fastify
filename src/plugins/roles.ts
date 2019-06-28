import { Role } from "../models/role.entity";
import * as templatedModule from "../core";
export default templatedModule.server(templatedModule.CRUD, { entityClass: Role });
