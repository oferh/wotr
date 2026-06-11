export interface Exercise {
  id: string;
  name: string;
  englishName?: string;
  muscleGroup: string;
  sets: number | string;
  reps: string;
  weight?: string;
  notes?: string;
  station?: number;
  completed?: boolean;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  archived?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  workouts: Record<string, Workout>;
}
