export interface RoutesResponse {
  routes: Route[];
}

export interface Route {
  _id: string;
  name: string | null;
  difficulty_level: string;
  distance: number;
  location: string;
  description: string;
  origin: string;
  destination: string;
  imageURL: string;
  author: string;
  __v: number;
}
