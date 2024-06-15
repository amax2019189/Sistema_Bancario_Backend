import { config } from "dotenv";

import Server from "./configs/server.js";
import addUsers from "./src/users/initUsers.js";
config()

const server = new Server()

server.listen()
addUsers();