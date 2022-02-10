const servername = "http://localhost:3000/api";

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

// Fetch GET
export const fetchGetApi = async function (uri: string) {
  let response = await fetch(servername + uri, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  console.log(response)
  let responseJson = await response.json();
  return responseJson;
};

// Fetch DELETE
export const fetchDeleteApi = async function (uri: string) {
  let response = await fetch(servername + uri, {
    method: 'DELETE'
  });
  return response;
};

// Fetch PATCH
export const fetchPatchApi = async function (uri: string, args: {target: string, value: string | number}) {
  let response = await fetch(servername + uri, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args)
  });

  return response.status;
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

