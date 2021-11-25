import * as bodyParser from "body-parser";
import * as express from "express";
import { Logger } from "../logger/logger";
import User from "./user";
import Restaurant from "./restaurant";

class Routes {

    public express: express.Application;
    public logger: Logger;

    // array to hold users
    public users: any[];

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.logger = new Logger();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {

        // user route
        this.express.use("/user", User);
        this.express.use("/restaurant", Restaurant);
    }
}

export default new Routes().express;