export interface ActivityCategory {
  id: string;
  name: string ;
  description: string ;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type ActivityCategoryRequest = Omit<ActivityCategory, 'id' | 'createdAt' | 'updatedAt'>;

export interface DailyExerciseResponse {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  durationMinutes: number;
  contentType: ExerciseContentType;
  contentTypeDisplay: string;
  contentUrl: string;
  thumbnailUrl: string;
  difficulty: ExerciseDifficultyType;
  difficultyDisplay: string;
  createdAt: string;
  updatedAt: string;
}

export type DailyExerciseRequest = Omit<DailyExerciseResponse, 'id' | 'categoryName' | 'contentTypeDisplay' | 'difficultyDisplay' | 'createdAt' | 'updatedAt'>

export enum ExerciseContentType {
  TEXTO = 'TEXTO',
  JUEGO = 'JUEGO',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

export enum ExerciseDifficultyType {
  PRINCIPIANTE = 'PRINCIPIANTE',
  INTERMEDIO = 'INTERMEDIO',
  AVANZADO = 'AVANZADO',
}
