import { useWorkoutStore, type WorkoutState } from '../store/useWorkoutStore';
import type { Workout } from '../types/workout';
import { Dumbbell, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function WorkoutSelector() {
  const currentPlan = useWorkoutStore((state: WorkoutState) => state.currentPlan);
  const startWorkout = useWorkoutStore((state: WorkoutState) => state.startWorkout);
  const getSuggestedWorkoutId = useWorkoutStore((state: WorkoutState) => state.getSuggestedWorkoutId);
  
  const suggestedId = getSuggestedWorkoutId();

  if (!currentPlan) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold px-1">Select Workout</h2>
      <div className="grid gap-3">
        {(Object.values(currentPlan.workouts) as Workout[]).map((workout) => {
          const isSuggested = workout.id === suggestedId;
          
          return (
            <Card
              key={workout.id}
              onClick={() => startWorkout(workout.id)}
              className={cn(
                "relative transition-all duration-300 cursor-pointer overflow-hidden",
                "hover:scale-[1.02] active:scale-[0.98]",
                isSuggested 
                  ? "border-primary shadow-lg shadow-primary/10 bg-primary/5" 
                  : "hover:border-primary/50"
              )}
            >
              <CardContent className="p-5 flex items-center gap-4">
                {isSuggested && (
                  <Badge variant="default" className="absolute top-3 right-3">
                    Recommended
                  </Badge>
                )}
                
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  isSuggested ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <Dumbbell className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg leading-none mb-2 mt-1">{workout.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {workout.exercises.length} Exercises
                  </p>
                </div>

                <ArrowLeft className={cn(
                  "w-5 h-5 transition-colors",
                  isSuggested ? "text-primary" : "text-muted-foreground/50"
                )} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
