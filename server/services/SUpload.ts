import Model from "../models"
import { UploadImagesAttributes } from "../interfaces/IUpload"
import {
  RESTAURANT,
  ACCOMMODATION,
  UPLOAD_PATH,
  IMAGES_ID_LIST
} from "../constant";
const path = require('path');
const fs = require('fs');
const formidableMiddleware = require("express-formidable");


class UploadService {
  async uploadImages(payload: UploadImagesAttributes) {
    try {
      const length = payload.length;
      const category: number = Number(payload.category);
      const dir = UPLOAD_PATH[category];
      const files: { [key: string]: File } | any = payload.files;
      let image_bulk: object[] = [];
      for (let [key, val] of Object.entries(files)) {
        const file: File = files[key];
        const file_name = file.name
        const target_text = IMAGES_ID_LIST[category]
        const file_name_split = file_name.split(".")
        const seq = Number(file_name_split[0].split("_")[file_name_split[0].split("_").length - 2]);
        let target_idx = undefined;
        if ([RESTAURANT, ACCOMMODATION].includes(category) == true) {
          target_idx = 0;
        } else {
          target_idx = 1;
        }
        const target = Number(file_name.split(".")[0].split("_")[target_idx]);
        const file_path = __dirname + '/../uploads' + dir + file_name;
        fs.readFile(file_path, (error: any, data: any) => {
          fs.writeFile(file_path, `${data}`, async function (error: any) {
            if (error) {
              console.error(error);
            } else {
              image_bulk.push({
                file_name: file_name,
                category: category,
                [target_text]: target,
                seq: seq,
              })

              if (image_bulk.length == length) {
                const upload_images = await Model.Images.bulkCreate(image_bulk, {});

                return upload_images
              }
            }
          })
        })
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default UploadService