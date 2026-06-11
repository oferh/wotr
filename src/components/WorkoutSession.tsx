import React, { useState, useEffect } from 'react';
import { useWorkoutStore, type WorkoutState } from '../store/useWorkoutStore';
import { ArrowRight, Check, Trophy, Loader2, Search, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ExerciseWeightInputProps {
  workoutId: string;
  exerciseId: string;
  initialWeight: string;
}

function ExerciseWeightInput({ workoutId, exerciseId, initialWeight }: ExerciseWeightInputProps) {
  const [weight, setWeight] = useState(initialWeight);
  const updateExerciseWeight = useWorkoutStore((state) => state.updateExerciseWeight);

  useEffect(() => {
    setWeight(initialWeight);
  }, [initialWeight]);

  const handleSave = async () => {
    const trimmed = weight.trim();
    if (trimmed !== initialWeight.trim()) {
      await updateExerciseWeight(workoutId, exerciseId, trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div 
      onClick={(e) => e.stopPropagation()} 
      className="flex items-center gap-1.5 bg-muted/40 hover:bg-muted/60 focus-within:bg-background focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50 px-2.5 py-1 rounded-md border border-input transition-all duration-200"
    >
      <Dumbbell className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <input
        type="text"
        placeholder="Add weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="bg-transparent border-none outline-none text-sm font-semibold p-0 w-24 text-foreground placeholder:text-muted-foreground/40 placeholder:font-normal"
      />
    </div>
  );
}

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
              <CardContent className="p-5 flex items-start gap-5">
                {/* Custom Large Checkbox/Indicator */}
                <div className={cn(
                  "mt-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0",
                  isCompleted 
                    ? "bg-primary border-primary scale-110" 
                    : "border-muted-foreground/30"
                )}>
                  <Check className={cn(
                    "w-5 h-5 text-primary-foreground transition-transform duration-300",
                    isCompleted ? "scale-100" : "scale-0"
                  )} strokeWidth={3} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={cn(
                      "font-bold text-xl transition-colors leading-snug",
                      isCompleted && "text-muted-foreground line-through decoration-primary/30"
                    )}>
                      {exercise.name}
                    </h3>
                    <Button 
                      title="Search Google"
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10 -mt-1 -mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.google.com/search?q=${encodeURIComponent(exercise.englishName || exercise.name + ' exercise')}`, '_blank');
                      }}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {exercise.englishName && (
                    <p className="text-sm text-muted-foreground italic mt-1 truncate">
                      {exercise.englishName}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Badge variant="secondary" className="font-semibold text-sm px-3 py-1">
                      {exercise.sets} Sets
                    </Badge>
                    <Badge variant="secondary" className="font-semibold text-sm px-3 py-1">
                      {exercise.reps} Reps
                    </Badge>
                    <ExerciseWeightInput 
                      workoutId={activeWorkoutId}
                      exerciseId={exercise.id}
                      initialWeight={exercise.weight || ''}
                    />
                  </div>
                  
                  {exercise.notes && (
                    <div className="text-sm font-medium text-amber-700 dark:text-amber-400 mt-3 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-md border border-amber-100 dark:border-amber-900/50">
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
