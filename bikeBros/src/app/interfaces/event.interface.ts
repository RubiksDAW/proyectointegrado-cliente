export interface EventResponse {
  _id: string;
  ruta: Ruta | null;
  fecha: Date | null;
  ubicacion: string;
  participantes: User[] | null;
  maxParticipantes: number;
  creador: string;
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
  images: string;
  __v: number;
}
