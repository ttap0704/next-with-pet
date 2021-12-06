import * as express from "express";
import { Logger } from "../logger/logger";
import User from "./user";
import Restaurant from "./restaurant";
import Upload from "./upload";

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
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(express.json());
    }

    private routes(): void {
        this.express.use("/user", User);
        this.express.use("/restaurant", Restaurant);
        this.express.use("/upload", Upload);
    }
}

export default new Routes().express;