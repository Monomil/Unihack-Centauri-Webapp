export const birminghamLibrarySimulation = {
  db_operation: "SELECT * FROM centauri_points WHERE location_name = 'Birmingham Central Library'",
  user_message: "Birmingham Central Library is currently at 80% capacity. Due to high demand, loan durations are temporarily set to 12 hours to ensure everyone gets a turn.",
  ui_logic: "count_up_occupancy",
  data_payload: {
    location_name: "Birmingham Central Library",
    occupancy_stats: {
      occupied: 16,
      total: 20,
      ratio: 0.8,
      status: "HIGH_DEMAND"
    },
    rule_result: {
      loan_duration_hours: 12,
      max_loan_display: "12h"
    }
  }
};

console.log("Simulated Birmingham Library Response:", JSON.stringify(birminghamLibrarySimulation, null, 2));
