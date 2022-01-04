import * as express from "express";
import { Logger } from "../logger/logger";
import Model from '../models'

class Rooms {

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
  }

  private routes(): void {
    this.express.get("", async (req: express.Request, res: express.Response, next) => {
      let uid = undefined
      if (Number(req.query.uid) > 0) {
        uid = req.query.uid;
      }

      let page = undefined;
      if (Number(req.query.page) > 0) {
        page = Number(req.query.page);
      }

      let offset = 0;
      if (page > 1) {
        offset = 5 * (page - 1);
      }

      const tempSQL = Model.sequelize.dialect.queryGenerator.selectQuery('accommodation', {
        attributes: ['id'],
        where: {
          manager: uid,
        }
      })
        .slice(0, -1);

      const count = await Model.Rooms.count({
        where: {
          accommodation_id: {
            [Model.Sequelize.Op.in]: Model.sequelize.literal(`(${tempSQL})`)
          }
        }
      })

      const list = await Model.Rooms.findAll({
        where: {
          accommodation_id: {
            [Model.Sequelize.Op.in]: Model.sequelize.literal(`(${tempSQL})`)
          }
        },
        attributes: ['label', 'price', 'standard_num', 'maximum_num', 'amenities', 'additional_info', [
          Model.sequelize.literal(`(
            SELECT label
            FROM accommodation
            WHERE
            id = rooms.accommodation_id
          )`), 'accommodation_label'
        ]],
        offset: offset,
        limit: 5
      });

      res.json({count: count, rows: list})
    });
  }
}

export default new Rooms().express;

