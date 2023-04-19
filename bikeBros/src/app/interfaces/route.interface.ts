export interface RoutesResponse {
    routes: Route[];
}

export interface Route {
    _id:              string;
    name:             string;
    difficulty_level: string;
    distance:         number;
    location:         string;
    description:      string;
    origin:           string;
    destination:      string;
    imageURL:         string;
    __v:              number;
}
