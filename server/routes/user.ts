import * as express from "express";
import { Logger } from "../logger/logger";
// import Model from '../models'

class User {
    public express: express.Application;
    public logger: Logger;

    public data: object;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.logger = new Logger();
        this.data = {};
    }

    // Configure Express middleware.
    private middleware(): void {
    }

    private routes(): void {
        this.express.post("/join", (req:any, res:any, next) => {
            this.logger.info("url:::::::" + req.url);
            // console.log(Model.Users, 'users')
            // const user = await Users.create({
            //     username: 'alice123',
            //     isAdmin: true‹
            //   }, { fields: ['username'] });
            this.data = req.body;
            res.json(this.data);
        });
    }
}

export default new User().express;