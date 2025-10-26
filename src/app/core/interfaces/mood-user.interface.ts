import { Content } from '../models/mood.model';

export interface UserMood {
  id: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  },
  description: string;
  mood: Content;
  recordedDate: string;
}
