import { fetchPostApi, fetchGetApi } from "./_API";

const path = "/restaurant";

export function addRestaurantApi(path2, data) {
  return new Promise((resolve, reject) => {
    try {
      const res = fetchPostApi(path + path2, data)
      resolve(res);
    } catch (error) {
      console.error(error);
      return false;
    }
  })
}

export function getRestaurantApi(path2) {
  return new Promise((resolve, reject) => {
    try {
      const res = fetchGetApi(path + path2)
      resolve(res);
    } catch (error) {
      console.error(error);
      return false;
    }
  })
}