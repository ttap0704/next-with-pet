export const RESTAURANT = 1;
export const ACCOMMODATION = 2;

export const EXPOSURE_MENU = 11;
export const ENTIRE_MENU = 12;
export const ROOMS = 21;

export const UPLOAD_PATH:{
  [prop: number]: any;
} = {
  [RESTAURANT]: '/restaurant/',
  [EXPOSURE_MENU]: '/exposure_menu/',
  [ACCOMMODATION]: '/accommodation/',
  [ROOMS]: '/rooms/',
}

export const CATEGORY_LIST: {
  [prop: number]: any;
} = {
  [RESTAURANT]: 'Restarunt',
  [EXPOSURE_MENU]: 'ExposureMenu',
  [ENTIRE_MENU]: 'EntireMenu',
  [ACCOMMODATION]: 'Accomodation',
  [ROOMS]: 'Rooms',
}

export const IMAGES_ID_LIST: {
  [prop: number]: any;
} = {
  [RESTAURANT]: 'restaurant_id',
  [EXPOSURE_MENU]: 'exposure_menu_id',
  [ACCOMMODATION]: 'accommodation_id',
  [ROOMS]: 'rooms_id',
}