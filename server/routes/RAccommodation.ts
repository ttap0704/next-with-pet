import * as express from "express";
import { Logger } from "../logger/logger";
import Model from '../models'

import { RESTAURANT } from "../constant";
import { Category } from "../interfaces/IRestaurant"

class Accommodation {

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
    this.express.get("", async (req: any, res: any, next) => {
      const list = await Model.Accommodation.findAll({
        include: [
          {
            model: Model.Images,
            as: 'accommodation_images',
            require: true,
          }
        ],
        attributes: ['sigungu', 'bname', 'label', 'id']
      });

      res.json(list)
    });

    this.express.get("/:id", async (req: express.Request, res: express.Response, next) => {
      const id = req.params.id;

      const accommodation = await Model.Accommodation.findOne({
        include: [
          {
            model: Model.Rooms,
            as: 'accommodation_rooms',
            require: true,
            include: [
              {
                model: Model.Images,
                as: 'rooms_images',
                require: true,
              }
            ]
          },
          {
            model: Model.Images,
            as: 'accommodation_images',
            require: true
          }
        ],
        where: { id: id }
      })


      res.json(accommodation)
    })

    this.express.post("/add", async (req: any, res: any, next) => {
      this.logger.info("url:::::::" + req.url);
      const data = req.body;
      const manager = req.session.uid;
      const accommodation = await Model.Accommodation.create({
        bname: data.bname,
        building_name: data.building_name,
        detail_address: data.detail_address,
        label: data.label,
        sido: data.sido,
        sigungu: data.sigungu,
        zonecode: data.zonecode,
        road_address: data.road_address,
        manager: manager,
        introduction: data.introduction
      }, {
        fields: ['bname', 'building_name', 'detail_address', 'label', 'sido', 'sigungu', 'zonecode', 'road_address', 'manager', 'introduction']
      });

      const accommodation_id = accommodation.dataValues.id;

      let data_rooms = data.rooms;
      for (let x of data_rooms) {
        x.accommodation_id = accommodation_id;
      }
      const rooms = await Model.Rooms.bulkCreate(data_rooms, { fields: ['label', 'maximum_num', 'price', 'standard_num', 'accommodation_id', 'amenities', 'additional_info'] });

      res.json({ accommodation_id, rooms });
    });
  }
}

export default new Accommodation().express;

