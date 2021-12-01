import * as bodyParser from "body-parser";
import * as express from "express";
import { Logger } from "../logger/logger";
const multer   = require('multer');
const storage  = multer.diskStorage({ 
  destination(req:any, file:any, cb:any) {
    console.log(file)
    cb(null, '../uploads');
  },
  filename(req:any, file:any, cb:any) {
    console.log(file)
    cb(null, `${Date.now()}__${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

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

    // this.express.post("/image/single",, (req:any, res:any, next) => {
    //   res.send('성공')
    // });

    this.express.post("/image/multi", upload.single('images'), (req: any, res: any, next) => {
        console.log(req);
      res.send('hi')
    });
  }
}

export default new Upload().express;