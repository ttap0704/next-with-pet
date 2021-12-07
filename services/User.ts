import { fetchPostApi,  } from "./_API";

const path = "/user";

export function checkUser(path2, data) {
  return new Promise((resolve, reject) => {
    try {
      const res = fetchPostApi(path + path2, data)
      resolve(res);
    } catch (error) {
      console.error(error);
      reject(error);
      return false;
    }
  })
}


export function createUserApi(path2, data) {
  return new Promise((resolve, reject) => {
    try {
      const res = fetchPostApi(path + path2, data)
      resolve(res);
    } catch (error) {
      console.error(error);
      reject(error);
      return false;
    }
  })
}
