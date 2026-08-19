# Fitness App — Workout Tracking Plan

A plan for a workout-tracking app that imports an existing Daily Strength export
(5.5 years of training history) and supports logging new workouts and managing
multiple gym locations with different equipment.

## 1. What's in the source data

The `daily_strength_2026_08_15.zip` export contains 24 JSON tables. Everything is
keyed by UUID, dates are epoch-milliseconds, and records embed related objects
(sessions embed exercises, exercises embed equipment).

| Data | Size | Notes |
|---|---|---|
| `WorkoutSession` | 1,323 sessions (all complete) | Feb 2021 → Aug 2026; name, start/end date, embedded exercises |
| `WorkoutSessionExercise` | 48,352 | position, supersets, embedded sets |
| `WorkoutSessionSet` | 162,173 | weight, reps, unit, rest time, warm-up/drop-set/failure flags, precomputed `oneRepMax` |
| `Exercise` | 707 | instructions, category (e.g. `weight_and_reps`), mechanics (compound/isolation), primary muscle groups, emphasized regions, `equipmentRequired[]`, experience level, custom flag |
| `Equipment` | 60 | catalog with categories (`free_weights`, `benches`, …) and thumbnails |
| `Workout` + `WorkoutExercise` + `WorkoutExerciseSet` | 149 / 995 / 3,241 | reusable templates: target min/max reps, rest, set flags |
| `Schedule` | 33 | multi-week programs (e.g. StrongLifts 5x5): days/week, goal, level, workout list |
| `Bar` / `Plate` | 4 / 12 | the user's bar weights and plate inventory (drives a plate calculator) |
| `MuscleGroup` | 35 | id + name |
| `Measurement` / `MeasurementLog` | 19 / 0 | body measurement types; no logged values yet |
| `StatisticsExercise` | 8 | exercises pinned for stats tracking |
| `ExerciseNotes` | 10 | per-exercise notes |
| `UserPreferences` | 1 | units, timers, and app settings |
| `Coach*`, `User`, `Link` | — | bundled coach/marketing content; low priority for import |

Key takeaway: exercises already declare **which equipment they require**, which is
exactly the hook needed for the "different gyms have different equipment" feature.

## 2. Product concept

A personal, local-first workout tracker:

- **Import** the full Daily Strength history (idempotent — safe to re-run).
- **Log workouts**: start from a template or ad-hoc; per-set weight/reps/rest,
  warm-up/drop-set/failure flags, supersets, rest timer, plate calculator.
- **Gym locations** (new concept, not in the source data): each gym has its own
  equipment inventory, bars, and plates. A session is logged *at* a gym, and the
  exercise picker filters/suggests based on what's actually available there.
- **Progress**: e1RM trends, PRs, volume per muscle group, training calendar.

## 3. Architecture

- **Frontend:** Vite + Vue 3 + TypeScript, installable PWA (offline-first — it
  must work on a phone in a gym basement with no signal).
- **Storage:** SQLite in the browser (`wa-sqlite`/OPFS) — the dataset is ~180k
  rows of sets, which is beyond comfortable for naive IndexedDB queries but
  trivial for SQL with indexes. Dexie/IndexedDB is the fallback if we want zero
  WASM complexity.
- **No backend for MVP.** Data lives on-device; export/backup to a JSON/zip file
  mirroring the import format. Sync (e.g. a small server or file-based sync) is a
  later phase.
- **Charts:** lightweight charting lib (e.g. Chart.js or uPlot) for e1RM/volume trends.

## 4. Data model (normalized)

```
Gym            id, name, notes
GymEquipment   gymId → equipmentId          (inventory per location)
GymBar/GymPlate per-gym bar & plate sets    (seeded from Bar.json / Plate.json)

Equipment      id, name, category
Exercise       id, name, category, mechanics, instructions, custom
ExerciseEquipment  exerciseId → equipmentId (from equipmentRequired)
ExerciseMuscle exerciseId → muscleGroupId (+ primary/emphasized flag)

WorkoutTemplate         id, name
TemplateExercise        templateId, exerciseId, position, supersetGroup
TemplateSet             minReps, maxReps, restTime, warmUp, dropSet, untilFailure

Session        id, name, gymId?, startedAt, endedAt, templateId?
SessionExercise sessionId, exerciseId, position, supersetGroup
SessionSet     weight, unit, reps, restTime, flags, e1rm (computed, not trusted from import)

MeasurementType / MeasurementLog
Program (Schedule), ProgramWorkout
```

Source UUIDs are preserved as primary keys so re-imports upsert instead of duplicate.

## 5. Gym-location behavior

1. User creates gyms ("Home", "Downtown 24hr", "Hotel") and checks off equipment
   from the 60-item catalog (plus custom entries).
2. Starting a session asks (or remembers) the gym; it's stored on the session.
3. Exercise picker: filter "available here"; exercises whose required equipment
   is missing are flagged rather than hidden.
4. **Substitutions:** when a template exercise can't be done at the current gym,
   suggest alternatives matching primary muscle group + mechanics type whose
   equipment *is* available (the export's muscle/equipment metadata makes this a
   pure query, no ML needed).
5. Plate calculator uses the *current gym's* bars/plates.

## 6. Import pipeline

- Read the zip client-side (user drops the file in Settings → Import).
- Order: MuscleGroup → Equipment → Exercise → Bars/Plates → Templates →
  Schedules → Sessions/Sets → Notes → Preferences.
- Validate with zod schemas per table; report per-table counts and skipped rows.
- Recompute e1RM (Epley/Brzycki) instead of trusting the stored `oneRepMax`.
- Skip coach/marketing tables (`Coach*`, `User`, `Link`) initially.

## 7. Phases

**Phase 1 — MVP:** schema + import, session history browser/calendar, workout
logging (from template or ad-hoc) with rest timer, exercise library with search
and muscle/equipment filters.

**Phase 2 — Gyms & insight:** gym locations + equipment inventories, availability
filtering + substitution suggestions, plate calculator, per-exercise stats
(e1RM/volume/PRs), pinned exercises (from `StatisticsExercise.json`).

**Phase 3 — Programs & body:** multi-week programs from `Schedule.json`,
measurement logging, reminders, export/backup, optional sync.

## 8. Open questions

- Web PWA only, or eventually native (Capacitor would reuse the same codebase)?
- Single-user, or multi-profile?
- Is sync/cloud backup a must-have, or is file export enough?
- Anything from the trailing "…wait" in the original request 🙂
