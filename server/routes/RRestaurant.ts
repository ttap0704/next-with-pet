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
    this.express.get("", getRestaurant);
    this.express.get("/:id", getRestaurantOne)
    this.express.get("/:id/category", getAdminRestaurantCategory)
    this.express.post("/:id/:menu", addMenu)
    this.express.post("/add", createRestaurant)
    this.express.patch("/:id", patchRestaurant);
    this.express.delete("/:id", deleteRestaurant)

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
          order: [[{model: Model.Images, as: 'restaurant_images'}, 'seq', 'ASC']],
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
          order: [[{model: Model.Images, as: 'restaurant_images'}, 'seq', 'ASC']],
          offset: offset,
          limit: 5,
        });
        res.json({ count: count, rows: list })
      }
    }

    async function getRestaurantOne(req: express.Request, res: express.Response, next: express.NextFunction) {
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
              }
            ],
            order: [[Model.Images, 'seq', 'ASC']]
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
          }
        ],
        order: [[{model: Model.Images, as: 'restaurant_images'}, 'seq', 'ASC']],
        where: { id: id },
      })

      res.json(restaurant)
    }

    async function getAdminRestaurantCategory(req: express.Request, res: express.Response, next: express.NextFunction) {
      const id = req.params.id;

      const tempSQL = Model.sequelize.dialect.queryGenerator.selectQuery('entire_menu', {
        attributes: ['category_id'],
        where: {
          restaurant_id: id,
        }
      })
        .slice(0, -1);

      const category = await Model.EntireMenuCategory.findAll({
        where: {
          id: {
            [Model.Sequelize.Op.in]: Model.sequelize.literal(`(${tempSQL})`)
          }
        },
        group: ['id']
      })

      res.status(200).json(category)
    }

    async function addMenu(req: express.Request, res: express.Response, next: express.NextFunction) {
      const id = req.params.id;
      const menu = req.params.menu;

      if (menu == 'exposure_menu') {
        const data = {
          label: req.body.label,
          price: req.body.price,
          comment: req.body.comment,
          restaurant_id: id.toString()
        }

        console.log(data, 'data')

        const menu = await Model.ExposureMenu.create(data, { fields: ['label', 'price', 'comment', 'restaurant_id', 'id'] });

        res.status(200).send(menu);
      }

    }

    async function createRestaurant(req: any, res: any, next: any) {
      // this.logger.info("url:::::::" + req.url);
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
    }

    async function patchRestaurant(req: express.Request, res: express.Response, next: express.NextFunction) {
      const id = req.params.id;
      const target = req.body.target;
      const value = req.body.value;

      const code = await Model.Restaurant.update({ [target]: value }, {
        where: {
          id: id
        }
      })
      if (code >= 0) {
        res.status(200).send()
      } else {
        res.status(500).send()
      }
    }

    async function deleteRestaurant (req: express.Request, res: express.Response, next: express.NextFunction) {
      const id = req.params.id;

      const code1 = await Model.EntireMenu.destroy({
        where: {
          accommodation_id: id
        }
      })

      const code2 = await Model.ExposureMenu.destroy({
        where: {
          accommodation_id: id
        }
      })

      const code3 = await Model.Restaurant.destroy({
        where: {
          id: id
        }
      })

      if (code1 >= 0 && code2 >= 0 && code3 >= 0) {
        res.status(200).send();
      } else {
        res.status(500).send();
      }
    }


  }
}

export default new Restraunt().express;