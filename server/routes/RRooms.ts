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
        include: [
          {
            model: Model.Images,
            as: 'rooms_images',
            require: true
          },
        ],
        attributes: ['id', 'label', 'price', 'standard_num', 'maximum_num', 'amenities', 'additional_info', 'accommodation_id', [
          Model.sequelize.literal(`(
            SELECT label
            FROM accommodation
            WHERE
            id = rooms.accommodation_id
          )`), 'accommodation_label'
        ]],
        offset: offset,
        order: [[{model: Model.Images, as: 'rooms_images'}, 'seq', 'ASC']],
        limit: 5
      });

      res.json({ count: count, rows: list })
    });

    this.express.post("/add", async (req: express.Request, res: express.Response, next) => {
      const body = req.body;
      const data = {
        ...req.body
      }

      const rooms = await Model.Rooms.create(data, { fields: ['label', 'maximum_num', 'price', 'standard_num', 'accommodation_id', 'amenities', 'additional_info'] });

      console.log(rooms);
      if (rooms) {
        res.status(200).send(rooms)
      } else {
        res.status(500).send()
      }
    })

    this.express.delete("/:id", async (req: express.Request, res: express.Response, next) => {
      const id = req.params.id;

      const code = await Model.Rooms.destroy({
        where: {
          id: id
        }
      })
      if (code >= 0) {
        res.status(200).send()
      } else {
        res.status(500).send()
      }
    })

    this.express.patch("/:id", async (req: express.Request, res: express.Response, next) => {
      const id = req.params.id;
      const target = req.body.target;
      const value = req.body.value;

      const code = await Model.Rooms.update({ [target]: value }, {
        where: {
          id: id
        }
      })
      if (code >= 0) {
        res.status(200).send()
      } else {
        res.status(500).send()
      }
    })
  }
}

export default new Rooms().express;

