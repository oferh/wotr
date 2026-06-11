import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, where, doc, onSnapshot, setDoc } from 'firebase/firestore';
import type { Plan } from '../types/workout';

interface WorkoutHistory {
  id: string;
  date: string;
  workoutId: string;
  completedExercises: string[];
  userId?: string;
}

export interface WorkoutState {
  currentPlan: Plan | null;
  history: WorkoutHistory[];
  error: string | null;
  activeWorkoutId: string | null;
  completedExercises: string[]; // IDs of exercises completed in the current active session
  
  // Actions
  startWorkout: (workoutId: string) => void;
  toggleExercise: (exerciseId: string) => void;
  finishWorkout: () => Promise<void>;
  cancelWorkout: () => void;
  getSuggestedWorkoutId: () => string;
  fetchHistory: () => Promise<void>;
  subscribeToPlan: () => () => void; // Returns unsubscribe function
  updateExerciseWeight: (workoutId: string, exerciseId: string, weight: string) => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      currentPlan: null,
      history: [],
      error: null,
      activeWorkoutId: null,
      completedExercises: [],

      startWorkout: (workoutId) => {
        set({ 
          activeWorkoutId: workoutId, 
          completedExercises: [] 
        });
      },

      toggleExercise: (exerciseId) => {
        set((state) => {
          const isCompleted = state.completedExercises.includes(exerciseId);
          return {
            completedExercises: isCompleted
              ? state.completedExercises.filter((id) => id !== exerciseId)
              : [...state.completedExercises, exerciseId],
          };
        });
      },

      finishWorkout: async () => {
        const { activeWorkoutId, completedExercises, history } = get();
        const user = auth.currentUser;
        if (!activeWorkoutId || !user) return;

        const newEntry: WorkoutHistory = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          workoutId: activeWorkoutId,
          completedExercises,
          userId: user.uid,
        };

        // Save to Firestore
        try {
          await addDoc(collection(db, 'history'), newEntry);
        } catch (error) {
          console.error("Error adding document: ", error);
        }

        set({
          history: [newEntry, ...history], // Newest first
          activeWorkoutId: null,
          completedExercises: [],
        });
      },

      cancelWorkout: () => {
        set({ activeWorkoutId: null, completedExercises: [] });
      },

      getSuggestedWorkoutId: () => {
        const { history, currentPlan } = get();
        if (!currentPlan || history.length === 0) {
          // Default to first available workout if no history or no plan
          return currentPlan ? Object.keys(currentPlan.workouts)[0] : '';
        }
        
        const lastWorkoutId = history[0].workoutId;
        const workoutKeys = Object.keys(currentPlan.workouts);
        const lastIndex = workoutKeys.indexOf(lastWorkoutId);
        const nextIndex = (lastIndex + 1) % workoutKeys.length;
        return workoutKeys[nextIndex];
      },

      fetchHistory: async () => {
        const user = auth.currentUser;
        if (!user) {
            set({ history: [] });
            return;
        }

        try {
          const q = query(
            collection(db, 'history'), 
            where("userId", "==", user.uid),
            orderBy('date', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const history: WorkoutHistory[] = [];
          
          querySnapshot.forEach((doc) => {
            history.push(doc.data() as WorkoutHistory);
          });
          
          set({ history });
        } catch (error) {
           console.error("Error fetching history: ", error);
        }
      },

      subscribeToPlan: () => {
        set({ error: null }); // Reset error state on new subscription
        const planRef = doc(db, "plans", "default");
        // Real-time subscription
        const unsubscribe = onSnapshot(planRef, (doc) => {
            set({ error: null }); // Clear error on success
            if (doc.exists()) {
                set({ currentPlan: doc.data() as Plan });
            } else {
                console.log("No such plan!");
            }
        }, (error) => {
            console.error("Error fetching plan:", error);
            set({ error: "Access Denied. You are not authorized to view this workout plan." });
        });
        
        return unsubscribe;
      },

      updateExerciseWeight: async (workoutId, exerciseId, weight) => {
        const { currentPlan } = get();
        if (!currentPlan) return;

        const workouts = { ...currentPlan.workouts };
        const workout = workouts[workoutId];
        if (!workout) return;

        const exercises = workout.exercises.map((ex) => {
          if (ex.id === exerciseId) {
            return { ...ex, weight };
          }
          return ex;
        });

        workouts[workoutId] = { ...workout, exercises };
        const updatedPlan = { ...currentPlan, workouts };

        set({ currentPlan: updatedPlan });

        try {
          const planRef = doc(db, 'plans', 'default');
          await setDoc(planRef, { workouts }, { merge: true });
        } catch (error) {
          console.error("Error saving exercise weight: ", error);
        }
      }
    }),
    {
      name: 'wotr-storage-v1', // Increment version to bust cache
      partialize: (state) => ({ 
        // We can still persist everything locally for offline support/faster load
        // But history will be refreshed from Firestore when fetchHistory is called
        currentPlan: state.currentPlan,
        history: state.history,
        activeWorkoutId: state.activeWorkoutId,
        completedExercises: state.completedExercises
      }),
    }
  )
);
