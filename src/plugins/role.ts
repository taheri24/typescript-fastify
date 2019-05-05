import { Role } from "../entity/Role";
import { CRUD, templatedServer } from "../core";
export default templatedServer(CRUD, Role);
