import { fetchFileApi } from "./_API";

const path = "/upload";

export function uploadImages(path2, data) {
  return new Promise((resolve, reject) => {
    try {
      const res = fetchFileApi(path + path2, data)
      resolve(res);
    } catch (error) {
      console.error(error);
      return false;
    }
  })
}
