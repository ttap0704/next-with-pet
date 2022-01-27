import Model from "../models"
import {UsersAttributes, CreateUserAttributes} from "../interfaces/IUser"

class UserService {
  async create(payload: CreateUserAttributes) {
    const created_user = await Model.Users.create(payload, { fields: ['login_id', 'password', 'name', 'phone', 'nickname', 'type'] })

    return created_user;
  }
}

export default UserService