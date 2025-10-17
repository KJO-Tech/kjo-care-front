export interface UserMood {
  id: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  }
  mood: string;
  recordedDate: string;
}
