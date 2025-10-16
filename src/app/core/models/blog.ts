import { UserProfile } from './user-profile';

export interface Blog {
  id: string;
  title: string;
  content: string;
  image?: string;
  video?: string;
  publishedDate: string;
  modifiedDate: string;
  state: Status;
  author?: UserProfile;
  category?: Category;
}

export enum Status {
  Published = 'PUBLICADO',
  Draft = 'PENDIENTE',
  Deleted = 'ELIMINADO',
}

export interface Category {
  id: string;
  name: string;
}

export interface Reaction {
  id: number;
  blogId: number;
  userId: number;
  type: string;
  reaction: string;
}

export interface FilterDTO {
  search: string;
  category: string;
  status: string;
}
