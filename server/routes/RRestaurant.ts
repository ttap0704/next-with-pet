import * as express from "express";
import { Logger } from "../logger/logger";
import Model from '../models'

import { RESTAURANT } from "../constant";
import { Category } from "../interfaces/IRestaurant"
import RestaurantService from "../services/SRestaurant"

class Restraunt {

  public express: express.Application;
  public logger: Logger;

  // array to hold users
  public data: object;
  public RestaurantService: RestaurantService;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.data = {};
    this.logger = new Logger();
    this.RestaurantService = new RestaurantService();
  }

  // Configure Express middleware.
  private middleware(): void {
  }

  private routes(): void {
    this.express.get("", getRestaurant);
    this.express.get("/:id", this.getRestaurantOne)


    async function getRestaurant(req: any, res: any, next: any) {
      let uid = undefined
      if (Number(req.query.uid) > 0) {
        uid = req.query.uid;
      }

      let list = undefined;
      if (!uid) {
        list = await Model.Restaurant.findAll({
          include: [
            {
              model: Model.Images,
              as: 'restaurant_images',
              require: true,
            }
          ],
          attributes: ['sigungu', 'bname', 'label', 'id'],
          order: [[{ model: Model.Images, as: 'restaurant_images' }, 'seq', 'ASC']],
        });
        res.json(list)
      } else {
        const count = await Model.Restaurant.count({
          where: {
            manager: uid
          }
        })

        let page = undefined;
        if (Number(req.query.page) > 0) {
          page = Number(req.query.page);
        }

        let offset = 0;
        if (page > 1) {
          offset = 5 * (page - 1);
        }

        list = await Model.Restaurant.findAll({
          where: {
            manager: uid
          },
          include: [
            {
              model: Model.ExposureMenu,
              as: 'exposure_menu',
              require: true
            },
            {
              model: Model.EntireMenu,
              as: 'entire_menu',
              require: true
            },
            {
              model: Model.Images,
              as: 'restaurant_images',
              attributes: ['seq', 'id', 'file_name', 'category', 'restaurant_id']
            }
          ],
          order: [[{ model: Model.Images, as: 'restaurant_images' }, 'seq', 'ASC']],
          offset: offset,
          limit: 5,
        });
        res.json({ count: count, rows: list })
      }
    }


  }

  getRestaurantOne = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const id = Number(req.params.id);

      const restaurant = await this.RestaurantService.getRestaurantOne({ restaurant_id: id })

      res.status(200).send(restaurant)
    } catch (err) {
      res.status(500).send()
      throw new Error(err);
    }

  }

}

export default new Restraunt().express;