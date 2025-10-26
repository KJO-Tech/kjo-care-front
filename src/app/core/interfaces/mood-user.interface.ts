import { Content } from '../models/mood.model';

export interface UserMood {
  id: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  }
  mood: Content;
  recordedDate: string;
}
