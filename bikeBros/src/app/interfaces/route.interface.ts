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
  images: string[];
  author: string;
  comments: Comment[] | null;
  __v: number;
}
