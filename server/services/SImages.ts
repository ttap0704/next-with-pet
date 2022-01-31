import Model from "../models"
import { ImagesBulkAttributes } from "../interfaces/IImages"

class ImagesService {
  async bulkCreate(payload: ImagesBulkAttributes) {
    
    const images = await Model.Images.bulkCreate(payload, {});

    return images;
  }

  async sendImage () {
    
  }
}

export default ImagesService