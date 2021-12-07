import * as express from "express";
import { Logger } from "../logger/logger";
import Model from '../models'
import {UsersAttributes} from "../interfaces/IUser"

class User {
  public express: express.Application;
  public logger: Logger;

  public data: object;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.logger = new Logger();
    this.data = {};
  }

  // Configure Express middleware.
  private middleware(): void {
  }

  private routes(): void {
    this.express.post("/login", (req, res, next) => {
      const login_id = req.body.id;
      const password = req.body.password;

      Model.Users.findOne(
        {
          where: {
            login_id: login_id
          }
        })
        .then(async (user:UsersAttributes) => {
          const validate = await Model.Users.prototype.validPassword(password, user.password)
          let message: string = "";
          let pass:boolean = false;
          if (validate) {
            message= `${user.nickname}님 환영합니다!`
            pass= true
          } else {
            message= '아이디, 비밀번호를 다시 확인해주세요.'
          }

          const data = {
            nickname: user.nickname, 
            login_id: user.login_id, 
            uid: user.id,
            profile_path: user.profile_path,
            message, 
            pass
          }

          res.json(data);
        }) 
    })

    this.express.post("/join", async (req: any, res: any, next) => {
      this.logger.info("url:::::::" + req.url);
      const data = req.body
      console.log(data);
      const user = await Model.Users.create({
        login_id: data.id,
        password: data.password,
        name: data.name,
        phone: data.phone,
        nickname: data.nickname,
        profile_path: 'super_profile.jpeg',
        type: 0
      }, { fields: ['login_id', 'password', 'name', 'phone', 'nickname', 'type'] });

      res.json(user);
    });
  }
}

export default new User().express;