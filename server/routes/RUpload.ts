import * as express from "express";
import { Logger } from "../logger/logger";
const fs = require('fs');
const formidableMiddleware = require("express-formidable");

class Upload {

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

    // this.express.post("/image/single",, (req:any, res:any, next) => {
    //   res.send('성공')
    // });

    this.express.post("/image/multi", (req: any, res: any, next) => {
      this.logger.info("url:::::::" + req.url);
      const length = req.fields.length;
      const files = req.files;
      let f_res:object[] = [];
      for (let [key,val] of Object.entries(files)) {
        const file = files[key];
        const file_name_arr = file.name.split(".")
        const file_extention = file_name_arr[file_name_arr.length - 1];
        const file_name = new Date().getTime() + (Math.random() * 100).toFixed(0).toString() + "." + file_extention;
        const file_path = __dirname + '/../uploads/' + file_name;
        fs.readFile(file.path, (error: any, data:any) => {
          fs.writeFile(file_path, data, function (error:any) {
            if(error) {
              console.error(error);
            } else {
              f_res.push({
                org_key: key,
                new_file_name: file_name,
              })
              if (f_res.length == length) res.json(f_res);
            }
          })
        })
      }
    })
  }
}

export default new Upload().express;