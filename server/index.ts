import * as http from "http";
import App from "./app";
import { Logger } from "./logger/logger";
const port = 3080;
const dotenv = require('dotenv');

dotenv.config()
// const { sequelize } = require('./models');
import db from "./models"

App.set("port", port);
const server = http.createServer(App);
db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Success DB Connection')
    })
    .catch((error: any) => {
        console.error(error);
    });
server.listen(port);

const logger = new Logger();

server.on("listening", function (): void {
    const addr = server.address();
    const bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
    logger.info(`Listening on ${bind}`);
});

module.exports = App;