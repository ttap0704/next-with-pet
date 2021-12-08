const servername = "/api";

// Fetch POST
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

// Fetch POST FILES
export const fetchFileApi = async function (uri: string, args: FormData) {
  let response = await fetch(servername + uri, {
    method: 'POST',
    body: args
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