import * as express from "express";
import { Logger } from "../logger/logger";
import {
  RESTAURANT,
  ACCOMMODATION,
  EXPOSURE_MENU,
  ENTIRE_MENU,
  ROOMS,
  UPLOAD_PATH,
  CATEGORY_LIST
} from "../constrant";
import Model from '../models'

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

    this.express.post("/image/multi", async (req: any, res: any, next) => {
      this.logger.info("url:::::::" + req.url);
      const length = req.fields.length;
      const category:number = Number(req.fields.category);
      const dir = UPLOAD_PATH[category];
      const files = req.files;
      const uid = req.session.uid;
      let image_bulk: object[] = [];
      for (let [key, val] of Object.entries(files)) {
        const file = files[key];
        const file_name = file.name
        const target = Number(file_name.split(".")[0].split("_")[1]);
        console.log(target)
        const file_path = __dirname + '/../uploads' + dir + file_name;
        fs.readFile(file.path, (error: any, data: any) => {
          fs.writeFile(file_path, data, async function (error: any) {
            if (error) {
              console.error(error);
            } else {
              image_bulk.push({
                file_name: file_name,
                category: category,
                target: target
              })

              if (image_bulk.length == length) {
                const upload_images = await Model.Images.bulkCreate(image_bulk, {
                  individualHooks: true,
                  fields: ['file_name', 'category', 'target']
                });

                console.log(upload_images)

                res.json(upload_images)
              }
            }
          })
        })
      }
    })
  }
}

export default new Upload().express;