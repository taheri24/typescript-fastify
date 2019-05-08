import { Role } from "../entity/Role";
import * as templatedModule from "templated-module";
export default templatedModule.server(templatedModule.CRUD, { entityClass: Role });
