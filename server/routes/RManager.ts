import * as express from "express";
import { Logger } from "../logger/logger";
import Model from '../models'

import { RESTAURANT } from "../constant";
import { Category } from "../interfaces/IRestaurant"

import RestaurantService from "../services/SRestaurant"

class Manager {

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
    // this.express.get("", getRestaurant);
    this.express.post("/:manager/restaurant", this.addManagerRestaurant)
    this.express.get("/:manager/restaurant", this.getManagerRestaurant)
    this.express.get("/:manager/restaurant/:menu", this.getManagerRestaurantMenu)
    this.express.get("/:manager/restaurant/:id/category", this.getManagerRestaurantCategory)
    this.express.post("/:manager/restaurant/:id/category", this.addManagerRestaurantCategory)
    this.express.post("/:manager/restaurant/:id/:menu", this.addManagerRestaurantMenu)
    this.express.patch("/:manager/restaurant/:id", this.patchManagerRestaurant);
    this.express.delete("/:manager/restaurant/:id", this.deleteManagerRestaurant)
    this.express.patch("/:manager/restaurant/:id/:menu/:menu_id", this.patchManagerRestaurantMenu)
    this.express.delete("/:manager/restaurant/:id/:menu/:menu_id", this.deleteManagerRestaurantMenu)
  }

  addManagerRestaurant = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const manager = Number(req.params.manager);
      const f_res = await this.RestaurantService.addManagerRestaurantList({ manager, data: req.body })

      res.status(200).send(f_res);
    } catch (err) {
      res.status(500).send();
      throw new Error(err);
    }

  }

  getManagerRestaurant = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const manager = Number(req.params.manager);
      const page = Number(req.query.page);

      const list = await this.RestaurantService.getManagerRestaurantList({ manager, page })

      res.status(200).send(list)
    } catch (err) {
      res.status(500).send()
      throw new Error(err);
    }
  }

  getManagerRestaurantMenu = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const manager = Number(req.params.manager);
      const menu = req.params.menu;
      const page = Number(req.query.page);

      const list = await this.RestaurantService.getManagerRestaurantMenuList({ manager, page, menu })

      res.status(200).send(list)
    } catch (err) {
      res.status(500).send()
      throw new Error(err);
    }
  }

  getManagerRestaurantCategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const restaurant_id = Number(req.params.id);

      const list = await this.RestaurantService.getManagerRestaurantCategoryList({ restaurant_id })

      res.status(200).send(list)
    } catch (err) {
      res.status(500).send()
      throw new Error(err);
    }
  }

  addManagerRestaurantCategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const restaurant_id = Number(req.params.id);
      const category = req.body.category

      const list = await this.RestaurantService.addManagerRestaurantCategoryList({ restaurant_id, category })

      res.status(200).send(list)
    } catch (err) {
      res.status(500).send()
      throw new Error(err);
    }
  }

  addManagerRestaurantMenu = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const restaurant_id = Number(req.params.id);
      const menu = req.params.menu;

      const res_menu = await this.RestaurantService.addManagerRestaurantMenuList({ restaurant_id, menu, data: req.body });

      res.status(200).send(res_menu);
    } catch (err) {
      res.status(500).send()
      throw new Error(err);
    }
  }

  patchManagerRestaurant = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const restaurant_id = Number(req.params.id);
      const target = req.body.target;
      const value = req.body.value;

      const response = await this.RestaurantService.eidtManagerRestaurant({ restaurant_id, target, value })

      if (response) {
        res.status(200).send();
      } else {
        res.status(500).send();
      }
    } catch (err) {
      res.status(500).send()
      throw new Error(err);
    }
  }

  deleteManagerRestaurant = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const restaurant_id = Number(req.params.id);

      const response = await this.RestaurantService.deleteManagerRestaurantList({ restaurant_id })

      if (response) {
        res.status(200).send();
      } else {
        res.status(500).send();
      }
    } catch (err) {
      res.status(500).send()
      throw new Error(err);
    }
  }

  patchManagerRestaurantMenu = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const restaurant_id = Number(req.params.id);
      const menu = req.params.menu;
      const menu_id = Number(req.params.menu_id);
      const target = req.body.target;
      const value = req.body.value;

      const response = await this.RestaurantService.eidtManagerRestaurantMenu({ restaurant_id, target, value, menu, menu_id })

      if (response) {
        res.status(200).send();
      } else {
        res.status(500).send();
      }
    } catch (err) {
      res.status(500).send()
      throw new Error(err);
    }
  }

  deleteManagerRestaurantMenu = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const restaurant_id = Number(req.params.id);
      const menu = req.params.menu;
      const menu_id = Number(req.params.menu_id);

      const response = await this.RestaurantService.deleteManagerRestaurantMenuList({ restaurant_id, menu, menu_id })

      if (response) {
        res.status(200).send();
      } else {
        res.status(500).send();
      }
    } catch (err) {
      res.status(500).send()
      throw new Error(err);
    }
  }
}

export default new Manager().express;