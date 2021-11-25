const servername = "/api";

// Fetch POSt
export const fetchPostApi = async function (uri: string, args: object) {
  let response = await fetch(servername + uri, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args)
  });
  let responseJson = await response.json();
  return responseJson;
};

// Fetch GET
export const fetchGetApi = async function (uri: string) {
  let response = await fetch(servername + uri, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  let responseJson = await response.json();
  return responseJson;
};