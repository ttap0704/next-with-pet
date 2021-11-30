import * as bodyParser from "body-parser";
import * as express from "express";
import { Logger } from "../logger/logger";

class Upload {

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
    this.express.use(bodyParser.urlencoded({ extended: true }));
  }

  private routes(): void {

    this.express.post("/image/multi", (req: any, res: any, next) => {
    });
  }
}

export default new Upload().express;