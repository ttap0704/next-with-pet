import * as express from "express";
import { Logger } from "../logger/logger";
import Model from "../models";
const fs = require('fs');

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
      res.status(200).sendFile(path.resolve(file_path));
    })

    this.express.delete('/:type/:id', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const type = req.params.type;
      const id = req.params.id;

      const images = await Model.Images.findAll({
        where: {
          [`${type}_id`]: id
        },
        attributes: ['file_name'],
        raw: true
      })

      if (images.length > 0) {
        for (let i = 0, leng = images.length; i < leng; i++) {
          const path = __dirname + "/../uploads/" + type + "/" + images[i].file_name
          fs.unlink(path, (err: Error) => {
            console.log(path)
            if (err) {
              console.log(err)
              res.status(500).send()
              return;
            }
          })

          if (i == leng - 1) {
            const code = await Model.Images.destroy({
              where: {
                [`${type}_id`]: id
              }
            })
            if (code >= 0) {
              res.status(200).send()
            } else {
              res.status(500).send()
            }
          }
        }
      } else {
        res.status(204).send()
      }
    })
  }
}

export default new Image().express;