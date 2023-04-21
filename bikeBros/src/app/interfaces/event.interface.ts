// export interface EventResponse {
//   _id: string;
//   ruta: Route;
//   fecha: Date;
//   participantes: User[];
//   maxParticipantes: number;
//   __v: number;
// }

// export interface User {
//   _id: string;
//   nick: string;
//   email: string;
//   password: string;
//   age: number;
//   description: string;
//   imageURL: string;
//   roles: string[];
//   __v: number;
// }

// export interface Route {
//   _id: string;
//   name: string;
//   difficulty_level: string;
//   distance: number;
//   location: string;
//   description: string;
//   origin: string;
//   destination: string;
//   imageURL: string;
//   __v: number;
// }
export interface EventResponse {
  _id: string;
  ruta: Ruta | null;
  fecha: Date | null;
  participantes: User[] | null;
  maxParticipantes: number;
  __v: number;
}

export interface User {
  _id: string;
  nick: string;
  email: string;
  password: string;
  age: number;
  description: string;
  imageURL: string;
  roles: string[];
  __v: number;
}

export interface Ruta {
  _id: string;
  name: string | null;
  difficulty_level: string;
  distance: number;
  location: string;
  description: string;
  origin: string;
  destination: string;
  imageURL: string;
  __v: number;
}
