import * as bodyParser from "body-parser";
import * as express from "express";
import { Logger } from "../logger/logger";

class Restraunt {

    public express: express.Application;
    public logger: Logger;

    // array to hold users
    public data: object;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.data = {};
        this.logger = new Logger();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {
        this.express.post("/add", (req, res, next) => {
            this.data = req.body;
            res.json(this.data);
        });
    }
}

export default new Restraunt().express;