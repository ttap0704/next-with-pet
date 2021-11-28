import * as bodyParser from "body-parser";
import * as express from "express";
import { Logger } from "../logger/logger";
const multer = require('multer');
const storage  = multer.diskStorage({
  destination(req:any, file:any, cb:any) {
    cb(null, 'uploads/');
  },
  filename(req:any, file:any, cb:any) {
    cb(null, `${Date.now()}__${file.originalname}`);
  },
});
const upload = multer({ storage: storage }).single('file');

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
    // this.express.post("/image/single", upload.single('file'), (req:any, res:any, next) => {
    //   res.send('성공')
    // });

    this.express.post("/image/multi", (req:any, res:any, next) => {
      upload(req, res, function (err:any) {
        if (err) {
          console.log(err)
        } else {
          console.log(req.files.file_0);
          res.send('Successfully uploaded ' + req.files.length + ' files!');
        }
      })
    });
  }
}

export default new Upload().express;