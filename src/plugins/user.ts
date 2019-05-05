import { User } from "../entity/User";
import {CRUD,templatedServer} from "../core";
export default  templatedServer(CRUD,User);
 