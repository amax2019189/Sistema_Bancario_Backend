import { config } from "dotenv";

import Server from "./configs/server.js";

config()

const server = new Server()

server.listen()