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

export async function createUser(data) {
  const response = await fetch(`/api/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: data })
  })
  return await response.json();
}