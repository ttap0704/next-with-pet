import * as express from "express";
import { Logger } from "../logger/logger";
import Model from '../models'

import { RESTAURANT } from "../constant";
import { Category } from "../interfaces/IRestaurant"

class Restraunt {

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
          attributes: ['sigungu', 'bname', 'label', 'id']
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
              require: true,
              order: ['seq', 'ASC']
            }
          ],
          offset: offset,
          limit: 5
        });
        res.json({ count: count, rows: list })
      }
    });

    this.express.get("/:id", async (req: express.Request, res: express.Response, next) => {
      const id = req.params.id;

      const restaurant = await Model.Restaurant.findOne({
        include: [
          {
            model: Model.ExposureMenu,
            as: 'exposure_menu',
            require: true,
            include: [
              {
                model: Model.Images,
                as: 'exposure_menu_image',
                require: true,
                order: ['seq', 'ASC']
              }
            ]
          },
          {
            model: Model.EntireMenu,
            as: 'entire_menu',
            require: true,
            attributes: ['price', 'label', [
              Model.sequelize.literal(`(
                SELECT category
                FROM entire_menu_category
                WHERE
                category_id = entire_menu_category.id
              )`), 'category'
            ]]
          },
          {
            model: Model.Images,
            as: 'restaurant_images',
            require: true,
            order: ['seq', 'ASC']
          }
        ],
        where: {id: id}
      })

      
      res.json(restaurant)
    })

    this.express.post("/add", async (req: any, res: any, next) => {
      this.logger.info("url:::::::" + req.url);
      const data = req.body;
      const manager = req.session.uid;
      const restaurant = await Model.Restaurant.create({
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

      let category: { category: string }[] = [];
      for (let i = 0, leng = data.entireMenu.length; i < leng; i++) {
        category.push({ category: data.entireMenu[i].category });
      };

      const restaurant_id = restaurant.dataValues.id;
      let entire_menu_category_arr: Category[] = [];
      for (let x of category) {
        const entire_menu_category = await Model.EntireMenuCategory.findOrCreate({ where: { category: x.category } });
        entire_menu_category_arr.push({
          id: entire_menu_category[0].dataValues.id,
          category: entire_menu_category[0].dataValues.category
        })
      }

      let entire_menu_bulk = [];
      for (let x of data.entireMenu) {
        const idx = entire_menu_category_arr.findIndex((item: Category) => {
          return item.category == x.category
        });

        for (let i = 0, leng = x.menu.length; i < leng; i++) {
          entire_menu_bulk.push({
            label: x.menu[i].label,
            price: x.menu[i].price,
            category_id: entire_menu_category_arr[idx].id,
            restaurant_id: restaurant_id
          })
        }
      }

      let exposure_menu_bulk = [];
      for (let x of data.exposureMenu) {
        exposure_menu_bulk.push({
          label: x.label,
          price: x.price,
          comment: x.comment,
          restaurant_id: restaurant_id
        })
      }

      const entire_menu = await Model.EntireMenu.bulkCreate(entire_menu_bulk, {
        individualHooks: true,
        fields: ['label', 'price', 'category_id', 'restaurant_id']
      });
      const exposure_menu = await Model.ExposureMenu.bulkCreate(exposure_menu_bulk, {
        individualHooks: true,
        fields: ['label', 'price', 'comment', 'restaurant_id']
      })

      const menus: object = {
        restaurant_id,
        entire_menu,
        exposure_menu
      }

      res.json(menus);
    });

    // this.express.delete("/:id", async (req: express.Request, res: express.Response, next) => {
    //   const id = req.params.id;

    //   res.status(200).send('Good Connection')
    // })
  }
}

export default new Restraunt().express;