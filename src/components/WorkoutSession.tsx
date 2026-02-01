import { useWorkoutStore, type WorkoutState } from '../store/useWorkoutStore';
import { ArrowRight, Check, Trophy, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function WorkoutSession() {
  const activeWorkoutId = useWorkoutStore((state: WorkoutState) => state.activeWorkoutId);
  const completedExercises = useWorkoutStore((state: WorkoutState) => state.completedExercises);
  const toggleExercise = useWorkoutStore((state: WorkoutState) => state.toggleExercise);
  const finishWorkout = useWorkoutStore((state: WorkoutState) => state.finishWorkout);
  const cancelWorkout = useWorkoutStore((state: WorkoutState) => state.cancelWorkout);
  const currentPlan = useWorkoutStore((state: WorkoutState) => state.currentPlan);

  if (!currentPlan || !activeWorkoutId) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    );
  }

  const workout = currentPlan.workouts[activeWorkoutId];

  if (!workout) return null;

  const progress = Math.round((completedExercises.length / workout.exercises.length) * 100);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={cancelWorkout} className="-mr-2">
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <h1 className="font-bold text-lg leading-tight">{workout.name}</h1>
          <p className="text-xs text-muted-foreground">{completedExercises.length}/{workout.exercises.length} Completed</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress Bar */}
      <div className="fixed top-[61px] left-0 right-0 z-20 bg-background">
        <Progress value={progress} className="h-1 rounded-none" />
      </div>

      {/* Exercise List */}
      <div className="p-4 space-y-3 mt-4">
        {workout.exercises.map((exercise) => {
          const isCompleted = completedExercises.includes(exercise.id);
          
          return (
            <Card
              key={exercise.id}
              onClick={() => toggleExercise(exercise.id)}
              className={cn(
                "transition-all duration-200 cursor-pointer select-none overflow-hidden",
                isCompleted 
                  ? "bg-muted/50 border-primary/20" 
                  : "hover:border-primary/50"
              )}
            >
              <CardContent className="p-4 flex items-start gap-4">
                {/* Custom Large Checkbox/Indicator */}
                <div className={cn(
                  "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0",
                  isCompleted 
                    ? "bg-primary border-primary scale-110" 
                    : "border-muted-foreground/30"
                )}>
                  <Check className={cn(
                    "w-3.5 h-3.5 text-primary-foreground transition-transform duration-300",
                    isCompleted ? "scale-100" : "scale-0"
                  )} strokeWidth={3} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "font-semibold text-base transition-colors leading-snug",
                    isCompleted && "text-muted-foreground line-through decoration-primary/30"
                  )}>
                    {exercise.name}
                  </h3>
                  
                  {exercise.englishName && (
                    <p className="text-xs text-muted-foreground italic mt-0.5 truncate">
                      {exercise.englishName}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="font-medium text-xs">
                      {exercise.sets} Sets
                    </Badge>
                    <Badge variant="secondary" className="font-medium text-xs">
                      {exercise.reps} Reps
                    </Badge>
                    {exercise.weight && (
                      <Badge variant="outline" className="text-xs border-primary/20 text-primary">
                        {exercise.weight}
                      </Badge>
                    )}
                  </div>
                  
                  {exercise.notes && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 mt-3 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-md border border-amber-100 dark:border-amber-900/50">
                      💡 {exercise.notes}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t z-20">
        <Button
          onClick={finishWorkout}
          disabled={completedExercises.length === 0}
          className="w-full h-12 text-lg font-bold shadow-lg"
          size="lg"
        >
          <Trophy className="w-5 h-5 mr-2" />
          Finish Workout
        </Button>
      </div>
    </div>
  );
}
