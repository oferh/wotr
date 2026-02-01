import { useWorkoutStore } from './store/useWorkoutStore';
import { useAuthStore } from './store/useAuthStore';
import { WorkoutSelector } from './components/WorkoutSelector';
import { HistoryCard } from './components/HistoryCard';
import { WorkoutSession } from './components/WorkoutSession';
import { Login } from './components/Login';
import { useEffect, useState } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

function App() {
  const activeWorkoutId = useWorkoutStore((state) => state.activeWorkoutId);
  const fetchHistory = useWorkoutStore((state) => state.fetchHistory);
  const subscribeToPlan = useWorkoutStore((state) => state.subscribeToPlan);
  const { user, setUser, loading: authLoading, setLoading: setAuthLoading } = useAuthStore();
  const [loaded, setLoaded] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
      setLoaded(true);
    });
    return () => unsubscribe();
  }, [setUser, setAuthLoading]);

  // Fetch data
  useEffect(() => {
    // Real-time plan subscription
    const unsubscribe = subscribeToPlan();
    return () => unsubscribe();
  }, [subscribeToPlan]);

  const error = useWorkoutStore((state) => state.error);

  // Fetch history when user triggers
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [fetchHistory, user]);

  if (!loaded || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (error) {
     setTimeout(() => {
        auth.signOut();
     }, 10000);

     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center space-y-4">
            <div className="p-4 bg-red-500/10 text-red-500 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground animate-pulse">Signing out in 10 seconds...</p>
            <button 
                onClick={() => auth.signOut()}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
                Sign Out Now
            </button>
        </div>
     );
  }

  if (activeWorkoutId) {
    return <WorkoutSession />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <div className="max-w-md mx-auto p-4 space-y-8 pb-12">

        <header className="flex items-center justify-between pt-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">WOTR</h1>
            <p className="text-muted-foreground text-sm font-medium">Your Personal Tracker</p>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 hover:opacity-90 transition-opacity"
            title="Sign Out"
          />
        </header>

        <section>
          <HistoryCard />
        </section>

        <section>
          <WorkoutSelector />
        </section>
      </div>
    </div>
  );
}

export default App