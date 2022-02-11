const servername = "http://localhost:3000/api";
import dotenv from 'dotenv'

dotenv.config();

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
export const fetchGetApi = async function (uri: string, token?: string) {
  let headers;
  if (token) {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      cookie: `access-token=${token};`,
    }
  } else {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }
  let response = await fetch(servername + uri, {
    method: 'GET',
    headers
  });
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
export const fetchPatchApi = async function (uri: string, args: { target: string, value: string | number }) {
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

// 사업자 인증 API
export const fecthCheckBusiness = async function (args: object) {
  console.log(process.env.BUSINESS_KEY)
  const uri = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${process.env.BUSINESS_KEY}`
  let response = await fetch(uri, {
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