import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Centauri CLRE Logic Helper (Rebranding from CLRE)
  const processCentauriLogic = (input: any) => {
    const { 
      action, 
      fsm_status, 
      state_school, 
      unemployed,
      reserved_count,
      total_capacity = 25,
    } = input;

    let score = 0;
    if (fsm_status) score += 3;
    if (state_school) score += 2;
    if (unemployed) score += 3;

    let status = "VALIDATED";
    let target_url = "/dashboard";
    let user_message = "Centauri Authentication: Systems operational.";
    let priority_level = score;
    let update_streak = false;

    if (action === "SIGNUP") {
      target_url = score > 6 ? "/priority-onboarding" : "/dashboard";
      user_message = score > 6 
        ? "Priority Centauri Status validated. Welcome to the elite track." 
        : "Centauri ID issued. Access granted to local hubs.";
    }

    if (action === "LOCKER_RESERVE") {
      if (reserved_count >= total_capacity) {
        status = "ERROR";
        user_message = "Centauri Hub: Capacity reached. Try a nearby Point.";
      } else {
        user_message = "Reservation locked. Your Centauri ID is now active for this Hub.";
      }
    }

    return {
      transaction_id: `CTX-${uuidv4().slice(0,8).toUpperCase()}`,
      current_status: status,
      target_url,
      user_message,
      backend_actions: {
        update_streak,
        priority_level,
        id_generated: true
      }
    };
  };

  app.post("/api/centauri/logic", (req, res) => {
    const result = processCentauriLogic(req.body);
    res.json(result);
  });

  // Gatekeeper Onboarding Logic
  app.post("/api/onboarding/process", async (req, res) => {
    try {
      const data = req.body;
      const {
        step,
        fullName,
        email,
        phone,
        password,
        stateSchool,
        fsmEligible,
        occupation,
        postcode,
        strengths,
        weaknesses,
      } = data;

      // Deterministic validation for steps 1-3
      let validation_errors: string[] | null = null;
      let is_complete = false;
      let priority_flag: "NORMAL" | "HIGH" = "NORMAL";
      let target_redirect = "/dashboard";
      let user_message = "Centauri Gatekeeper: Data packets received and validated.";
      let recommended_course = null;

      // Basic Step Logic
      if (step === 1) {
        if (password && (password.length < 8 || !/\d/.test(password))) {
          validation_errors = ["Security breach: Password must be 8+ characters with at least one number."];
        }
        if (phone && phone.length !== 11) {
          validation_errors = ["Transmission error: UK phone numbers must be 11 digits."];
        }
      }

      if (step === 2) {
        if (stateSchool === "Yes" && fsmEligible === "Yes") {
          priority_flag = "HIGH";
        }
      }

      const activeZones = ["SE", "E", "N", "W", "M", "B", "G", "L", "S"];
      const postcodePrefix = postcode?.trim().split(" ")[0].replace(/[0-9]/g, "").toUpperCase();
      const inZone = activeZones.includes(postcodePrefix);

      if (!inZone && step >= 3) {
        target_redirect = "/locker-hub";
        user_message = "You are outside our primary mentor zones, but you can still access our hardware lockers.";
      } else if (priority_flag === "HIGH" && step >= 3) {
        target_redirect = "/mentor-match-interview";
      }

      // Only invoke AI for the final step to generate career insights
      if (step === 4 && !validation_errors) {
        is_complete = true;
        const gatekeeperPrompt = `
          Analyze these student strengths and weaknesses to recommend a tech career path or course.
          Strengths: ${strengths}
          Weaknesses: ${weaknesses}
          Occupation: ${occupation}

          OUTPUT FORMAT (Strict JSON):
          {
            "recommended_course": {
              "title": "Course Title",
              "reason": "Brief, encouraging reason"
            },
            "user_message": "Friendly closing message."
          }
        `;

        try {
          const aiResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: gatekeeperPrompt }] }],
            config: { temperature: 0.2, responseMimeType: "application/json" }
          });

          const resText = aiResponse.text || "{}";
          const jsonMatch = resText.match(/\{[\s\S]*\}/);
          const aiResult = JSON.parse(jsonMatch ? jsonMatch[0] : resText);
          recommended_course = aiResult.recommended_course;
          user_message = aiResult.user_message || user_message;
        } catch (aiErr) {
          console.error("AI Onboarding Fallback:", aiErr);
          recommended_course = { 
            title: "Universal Tech Pilot", 
            reason: "Based on your balanced profile, we recommend starting with our core technology foundation." 
          };
        }
      }

      res.json({
        signup_step: `Step ${step}`,
        validation_errors,
        is_complete,
        priority_flag,
        target_redirect,
        user_message,
        recommended_course
      });
    } catch (error) {
      console.error("Onboarding Error:", error);
      res.status(500).json({ error: "Gatekeeper is currently offline." });
    }
  });

  // Career Guide AI
  app.post("/api/gemini/career", async (req, res) => {
    try {
      const { message, history, fileData } = req.body;
      
      const contents: any[] = [
        { 
          role: "user", 
          parts: [
            { text: `You are the Lead System Architect for Centauri, a social enterprise platform. Your goal is to manage the backend logic for a circular tech economy and mentorship ecosystem.

1. DATABASE & SCHEMA REQUIREMENTS:
Users: id, role (Mentee/Mentor), points_balance, current_streak.
PII (Encrypted): fsm_status, state_school_status, ethnicity, gender.
Centauri Points: id, location_name, total_slots, occupied_slots, gps_coords.
Mentorship: agreement_id, status (Matched/Active), mobility_type (Online/In-Person).

2. FUNCTIONAL LOGIC (The Specifics):
- The 75% Capacity Rule: When a user requests a laptop from a Centauri Point, calculate occupied_slots / total_slots. If result is >= 0.75, return a 12-hour loan duration. Otherwise, return 24-hour.
- The Streak Economy: Every time a mentor verifies a session, increment current_streak by 1 and points_balance by 1.
- Shop Tiers: Manage redemptions at 3, 5, and 12 points. At 12 points, trigger the generation of a Digital Career Passport.

3. UI & INTERACTION LOGIC:
- FAQ Accordion: Implement Mutual Exclusion. If one FAQ item is expanded, all others must be collapsed.
- Impact Metrics: Provide raw numerical data for "Laptops Loaned" and "Hours Mentored" to trigger a Fast Count-Up odometer animation (0 to N in 1.5s).

Tone: Maintain a "Levelling & Smooth" persona—professional, calm, and supportive.

TECHNICAL OUTPUT TASK:
When the user provides an action or message, you must respond strictly in JSON.

{
  "db_operation": "The specific SQL or NoSQL command needed.",
  "user_message": "A calm confirmation for the UI.",
  "ui_logic": "The specific animation trigger (e.g., count_up, accordion_slide, or redirect).",
  "data_payload": {
    "laptops_loaned": number,
    "hours_mentored": number,
    "target_url": "string (optional)",
    "streak": number (optional)
  }
}

Current User Message: ${message}` }
          ] 
        }
      ];

      if (fileData) {
        contents[0].parts.push({
          inlineData: {
            mimeType: fileData.mimeType,
            data: fileData.data
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
        config: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      });
      
      const resText = response.text || "{}";
      const jsonMatch = resText.match(/\{[\s\S]*\}/);
      const cleanedText = jsonMatch ? jsonMatch[0] : resText;
      const result = JSON.parse(cleanedText || "{}");
      
      res.json(result);
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to connect to Centauri AI" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "centauri-engine" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Centauri Engine running on http://localhost:${PORT}`);
  });
}

startServer();
