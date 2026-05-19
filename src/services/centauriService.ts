import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where 
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Centauri 75% Capacity Rule Implementation
 * Returns loan duration in hours (12 or 24) based on occupancy.
 */
export async function calculateLoanDuration(pointId: string): Promise<number> {
  if (!db) throw new Error("Firestore not initialized");

  const path = `centauri_points/${pointId}`;
  try {
    const pointDoc = await getDoc(doc(db, "centauri_points", pointId));
    
    if (!pointDoc.exists()) {
      throw new Error(`Centauri Point ${pointId} not found`);
    }

    const data = pointDoc.data();
    const occupied = data.occupied_slots || 0;
    const total = data.total_slots || 1; // Prevent div by zero
    
    const occupancyRatio = occupied / total;
    
    // The 75% Capacity Rule: 
    // If occupancy >= 0.75, return 12-hour loan. Otherwise, return 24-hour.
    return occupancyRatio >= 0.75 ? 12 : 24;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return 24; // Fallback
  }
}

/**
 * Simulated Simulation for Birmingham Central Library
 */
export async function simulateBirminghamLibrary() {
  // Mocking the behavior for the requested simulation
  const mockData = {
    location_name: "Birmingham Central Library",
    total_slots: 20,
    occupied_slots: 16
  };
  
  const ratio = mockData.occupied_slots / mockData.total_slots;
  const duration = ratio >= 0.75 ? 12 : 24;
  
  return {
    transaction_id: "SIM-" + Date.now(),
    location: mockData.location_name,
    stats: {
      occupied: mockData.occupied_slots,
      total: mockData.total_slots,
      occupancy_percent: (ratio * 100).toFixed(0) + "%"
    },
    rule_result: {
      is_high_demand: ratio >= 0.75,
      loan_duration_hours: duration
    }
  };
}
