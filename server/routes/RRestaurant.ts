import * as express from "express";
import { Logger } from "../logger/logger";
import Model from '../models'

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
    this.express.post("/add", async (req: any, res: any, next) => {
      this.logger.info("url:::::::" + req.url);
      console.log(req.session)
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
        indtroduction: data.introduction
      }, {
        fields: ['bname', 'building_name', 'detail_address', 'label', 'sido', 'sigungu', 'zonecode', 'road_address', 'manager', 'indtroduction']
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

      let expousre_menu_bulk = [];
      for (let x of data.exposureMenu) {
        expousre_menu_bulk.push({
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
      const exposure_menu = await Model.ExposureMenu.bulkCreate(expousre_menu_bulk, {
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
  }
}

export default new Restraunt().express;

function individualHooks(category: object[], individualHooks: any, arg2: boolean) {
  throw new Error("Function not implemented.");
}
