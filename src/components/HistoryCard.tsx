import { useWorkoutStore } from '../store/useWorkoutStore';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function HistoryCard() {
  const history = useWorkoutStore((state) => state.history);
  const currentPlan = useWorkoutStore((state) => state.currentPlan);

  const lastWorkout = history[0];

  const workoutName = useMemo(() => {
    if (!lastWorkout || !currentPlan) return null;
    return currentPlan.workouts[lastWorkout.workoutId]?.name || 'Unknown Workout';
  }, [lastWorkout, currentPlan]);

  if (history.length === 0 || !lastWorkout) {
    return (
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-3">
          <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center shadow-sm">
            <Calendar className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">No Workouts Yet</h3>
            <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
              Complete your first workout to start tracking progress!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const dateObj = new Date(lastWorkout.date);
  const formattedDate = dateObj.toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const formattedTime = dateObj.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="relative overflow-hidden group border-primary/20">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
      
      <CardHeader className="relative z-10 pb-2 flex flex-row items-start justify-between space-y-0">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
            Last Session
          </p>
          <CardTitle className="text-xl mb-1">{workoutName}</CardTitle>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="capitalize">{formattedDate}</span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span>{formattedTime}</span>
          </div>
        </div>
        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 pt-2">
        <div className="pt-4 border-t flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Exercises Completed:</span>
          <span className="font-semibold">{lastWorkout.completedExercises.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}
