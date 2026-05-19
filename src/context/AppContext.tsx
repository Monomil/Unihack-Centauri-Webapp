import React, { useState, createContext, useContext, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile 
} from "firebase/auth";
import { doc, onSnapshot, setDoc, collection, query, serverTimestamp } from "firebase/firestore";

interface CentauriAction {
  transaction_id: string;
  current_status: "VALIDATED" | "REJECTED" | "ERROR";
  target_url: string;
  user_message: string;
  backend_actions: {
    update_streak: boolean;
    id_generated: boolean;
    priority_level: number;
  };
}

interface UserProfile {
  uid: string;
  fullName: string;
  email: string | null;
  photoURL: string | null;
  isFSM: boolean;
  isStateSchool: boolean;
  isUnemployed: boolean;
  priorityLevel: number;
  streak: number;
  xp: number;
  badges: string[];
  updatedAt: any;
  onboardingComplete?: boolean;
  currentStep?: number;
}

interface AppContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  lastAction: CentauriAction | null;
  loading: boolean;
  triggerCentauri: (payload: any) => Promise<CentauriAction>;
  askAI: (message: string, fileData?: { data: string, mimeType: string }) => Promise<any>;
  processOnboarding: (data: any, isComplete?: boolean) => Promise<any>;
  bookings: any[];
  addBooking: (booking: any) => Promise<void>;
  submitMentorApplication: (data: any) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lastAction, setLastAction] = useState<CentauriAction | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Centauri Auth Check:", { auth: !!auth, db: !!db });
    if (!auth || !db) {
      setLoading(false);
      return;
    }
    let unsubscribeProfile: (() => void) | undefined;
    let unsubscribeBookings: (() => void) | undefined;
    
    try {
      const unsubscribeAuto = onAuthStateChanged(auth, (u) => {
        setUser(u);
        if (u) {
          setLoading(true);
          // Listen to Profile
          const profileRef = doc(db, "users", u.uid);
          unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data() as UserProfile);
            } else {
              setProfile(null);
            }
            // Once we have a profile response (even if null), check bookings
          });

          // Listen to Bookings
          const bookingsRef = collection(db, "users", u.uid, "bookings");
          unsubscribeBookings = onSnapshot(bookingsRef, (snapshot) => {
            const b = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBookings(b);
            setLoading(false);
          }, (err) => {
            console.error("Bookings Listener Error:", err);
            setLoading(false);
          });
        } else {
          setProfile(null);
          setBookings([]);
          setLoading(false);
        }
      });

      // Global safety timeout to prevent infinite loading screen
      const timer = setTimeout(() => {
        setLoading(false);
      }, 6000);

      return () => {
        unsubscribeAuto();
        if (unsubscribeProfile) unsubscribeProfile();
        if (unsubscribeBookings) unsubscribeBookings();
        clearTimeout(timer);
      };
    } catch (error) {
      console.error("Centauri Auth Error:", error);
      setLoading(false);
    }
  }, []);

  const triggerCentauri = async (payload: any) => {
    const body = {
      ...payload,
      uid: user?.uid
    };

    const response = await fetch("/api/centauri/logic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    setLastAction(data);

    if (data.current_status === "VALIDATED" && user && db) {
      const profileRef = doc(db, "users", user.uid);
      await setDoc(profileRef, {
        uid: user.uid,
        fullName: user.displayName || "Centauri Pilot",
        email: user.email,
        photoURL: user.photoURL,
        updatedAt: serverTimestamp(),
        priorityLevel: data.backend_actions.priority_level,
        ...(payload.action === "SIGNUP" ? {
          isFSM: payload.fsm_status || false,
          isStateSchool: payload.state_school || false,
          isUnemployed: payload.unemployed || false,
          streak: 0,
          xp: 100,
          badges: ["PIONEER"],
        } : {})
      }, { merge: true });
    }

    return data;
  };

  const askAI = async (message: string, fileData?: { data: string, mimeType: string }) => {
    const response = await fetch("/api/gemini/career", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, fileData }),
    });
    const data = await response.json();
    return data;
  };

  const processOnboarding = async (data: any, isComplete: boolean = false) => {
    // If user is logged in, sync to Firestore
    if (user && db) {
      const profileRef = doc(db, "users", user.uid);
      const updatedProfile: any = {
        fullName: data.fullName,
        isFSM: data.fsmEligible === "Yes",
        isStateSchool: data.stateSchool === "Yes",
        isUnemployed: data.occupation === "Unemployed",
        updatedAt: serverTimestamp(),
        onboardingComplete: isComplete,
        currentStep: data.step || 1
      };
      
      await setDoc(profileRef, updatedProfile, { merge: true });
      
      // Optimistic update to prevent redirect loops before Firestore listener triggers
      setProfile(prev => prev ? { ...prev, ...updatedProfile } : (updatedProfile as UserProfile));
    }

    if (isComplete) return { is_complete: true };

    const response = await fetch("/api/onboarding/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  };

  const addBooking = async (booking: any) => {
    if (!user || !db) return;
    const bookingId = booking.id || Math.random().toString(36).substr(2, 9);
    const bookingRef = doc(db, "users", user.uid, "bookings", bookingId);
    await setDoc(bookingRef, {
      ...booking,
      id: bookingId,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
  };

  const submitMentorApplication = async (data: any) => {
    if (!user || !db) return;
    const appId = Math.random().toString(36).substr(2, 9);
    const appRef = doc(db, "mentor_applications", appId);
    await setDoc(appRef, {
      ...data,
      id: appId,
      userId: user.uid,
      status: "PENDING",
      createdAt: serverTimestamp()
    });
  };

  const signUp = async (email: string, pass: string, name: string) => {
    if (!auth) return;
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    // Initialize profile in Firestore
    if (db) {
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        fullName: name,
        email: email,
        updatedAt: serverTimestamp(),
        xp: 100,
        streak: 0,
        badges: ["PIONEER"],
        onboardingComplete: false,
        currentStep: 2
      });
    }
  };

  const login = async (email: string, pass: string) => {
    if (!auth) return;
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  };

  return (
    <AppContext.Provider value={{ 
      user, profile, lastAction, loading, 
      triggerCentauri, askAI, processOnboarding, 
      bookings, addBooking, submitMentorApplication,
      signUp, login, logout
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
