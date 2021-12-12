import * as express from "express";
import { Logger } from "../logger/logger";
const path = require('path');
const formidableMiddleware = require("express-formidable");

class Image {

  public express: express.Application;
  public logger: Logger;

  // array to hold users
  public data: [];

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.data = [];
    this.logger = new Logger();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(formidableMiddleware())
  }

  private routes(): void {
    this.express.get('/:dir/:file_name', async (req: any, res: any, next) => {
      const file_path = __dirname + "/../uploads/" + req.params.dir + "/" + req.params.file_name;
      res.sendFile(path.resolve(file_path));
    })
  }
}

export default new Image().express;