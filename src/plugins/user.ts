import { User } from "../entity/User";
import * as templatedModule from "templated-module";
export default templatedModule.server(templatedModule.CRUD, { entity: User });