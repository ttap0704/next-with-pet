export interface RestaurantAttributes {
  id: number;
  bname: string | null;
  building_name: string | null;
  detail_address: string | null;
  label: string;
  sido: string | null;
  sigungu: string | null;
  zonecode: string | null;
  road_address: string | null;
  introduction: string | null;
}

export interface Category {
  id: number;
  category: string;
}