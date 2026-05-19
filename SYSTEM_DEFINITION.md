# Centauri: System Definition Document (v1.0)
## Technical Specification & Architecture Blueprint

### 1. User Persona Logic & Data Schema

#### 1.1 Mentee (Student) Profile
- **Base Fields**: `uid`, `email`, `display_name`, `account_created_at`.
- **Eligibility Markers (PII)**:
    - `is_fsm_eligible`: Boolean (Free School Meals).
    - `is_state_school`: Boolean.
    - `postcode_index`: String (Used for Index of Multiple Deprivation - IMD lookup).
- **Economic State**:
    - `current_streak`: Integer (Total mentor-signed sessions).
    - `points_balance`: Integer (Spendable).
    - `unlocked_rewards`: Array<RewardID>.
- **Validation**: Eligibility must be verified via ONS/Department for Education API or manual verification before `/shop` access is granted.

#### 1.2 Mentor Profile
- **Base Fields**: `uid`, `industry_role`, `company`, `bio`.
- **Mobility Logic**:
    - `mobility_type`: ENUM (`ONLINE_ONLY`, `HYBRID`, `IN_PERSON`).
    - `assigned_point_id`: String (Required if `IN_PERSON`).
- **Compliance State**:
    - `vetting_status`: ENUM (`UNVERIFIED`, `PENDING_REVIEW`, `DBS_CLEARED`, `REJECTED`).
    - `background_check_id`: String.
- **Commitment**: Mandatory boolean flag `one_meeting_per_week_agreement`.

---

### 2. The Mentorship Lifecycle (State Machine)

The transition between a mentee and mentor follows a strict deterministic flow:

1. **STATE: MATCHED**
   - Trigger: Mentee selects mentor profile in `/find-a-mentor`.
   - Action: Temporary lock on mentor "slot".
2. **STATE: COMMITMENT_SIGNED**
   - Trigger: Both parties sign electronic Code of Conduct.
   - Action: Generate `agreement_id`.
3. **STATE: INTERVIEW_BOOKED**
   - Trigger: Successful API call to `/api/booking`.
   - Action: Push notification to Centauri Mobile App.
4. **STATE: ACTIVE**
   - Trigger: Interview completed and "Intro Successful" flagged by Mentor.

---

### 3. The Streak & Shop Economy

#### 3.1 Point Conversion Logic
Points are earned through **Verified Sessions**.
- **Formula**: `1 Session (signed via Mentor Centauri ID) = +1 Streak Point`.
- **Streak Decay (Optional)**: If 21 days pass without a signed session, `current_streak` resets (for motivation), but `lifetime_points` remain.

#### 3.2 Inventory Tiers
| Tier | Cost (Pts) | Reward Type | Trigger Action |
| :--- | :--- | :--- | :--- |
| **Bronze** | 3 | Digital Toolkit | Grant access to `/resources/downloads` |
| **Silver** | 5 | Skills Voucher | Generate unique 12-digit vendor code |
| **Gold** | 12 | Professional Cert | Trigger "Career Passport" PDF generation |

#### 3.3 Digital Career Passport
A cryptographically verifiable document (JSON-LD or signed PDF) containing:
- Verified skills signatures.
- Total Streak history.
- Mentor endorsement hashes.

---

### 4. Centauri Point (Hardware) Logic

Inventory management for 5G Laptops and connectivity hubs.

#### 4.1 The 75% Capacity Rule (Loan Duration)
System must evaluate total locker occupancy at the time of reservation:
- **Condition A (Occupancy < 75%)**: 
    - `Default_Loan_Duration`: 24 Hours.
- **Condition B (Occupancy >= 75%)**: 
    - `Reduced_Loan_Duration`: 12 Hours (Enforces high turnaround in high-demand areas).

#### 4.2 Proximity Locking
- Users must be within 10 meters of the `GPS_COORDINATES` of the Centauri Point to initiate the `UNOCK_LOCKER` command via the app.

---

### 5. UI Component Logic

#### 5.1 FAQ Mutual Exclusion
- **Logical Rule**: `if (clicked_item.id !== currently_expanded.id) { currently_expanded.collapse(); clicked_item.expand(); }`.
- **Animation**: CSS `grid-template-rows` transition (0 $\to$ 1fr) for smooth height expansion.

#### 5.2 Odometer Animation (Impact Metrics)
- **Requirement**: Target numbers must increment from 0 to `N` using a `requestAnimationFrame` loop.
- **Easing**: Exponential Out (fast start, slow finish).

---

### 6. Security & Data Handling

#### 6.1 Encryption at Rest (AES-256)
Required for any fields mapping to:
- Ethnicity data.
- Gender identity.
- Disability status.
- Financial eligibility markers.

#### 6.2 Session Verification
- All "Mentor Signature" events must be signed with a JWT containing the `mentor_uid` and `mentee_uid`, verified by the server before any Streak Points are credited.
