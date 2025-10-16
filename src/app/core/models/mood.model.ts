export interface Mood {
  content: Content[];
  page:    number;
  size:    number;
}

export interface Content {
  id:          string;
  name:        string;
  description: string;
  state:       string;
  image:       string;
  color:       string;
  isActive:    boolean;
}
