import * as express from "express";
import { Logger } from "../logger/logger";
import Model from '../models'

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
    this.express.post("/add", async (req:any, res:any, next) => {
      this.logger.info("url:::::::" + req.url);
      console.log(req.session)
      const data = req.body;
      const restaurant = await Model.Restaurant.create({
        bname: data.bname,
        building_name: data.building_name,
        detail_address: data.detail_address,
        label: data.label,
        sido: data.sido,
        sigungu: data.sigungu,
        zonecode: data.zonecode,
        manager: 1
      }, { fields: ['bname', 'building_name', 'detail_address', 'label', 'sido', 'sigungu', 'zonecode', 'manager'] });

      const uid = restaurant.manager;

      let category:object[] = [];
      for (let i = 0, leng  = data.entireMenu.length; i < leng; i ++) {
        category.push({category: data.entireMenu[i].category});
      };

      const entire_menu = await Model.EntireMenuCategory.bulkCreate(category, {individualHooks: true} );

      res.json(entire_menu);
    });
  }
}

export default new Restraunt().express;

function individualHooks(category: object[], individualHooks: any, arg2: boolean) {
  throw new Error("Function not implemented.");
}
