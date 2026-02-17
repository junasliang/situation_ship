# situation_ship — Frontend (React Native iOS) — Agent Guide

## 0) Mission
Build the iOS React Native app UI for “situation_ship”:
- Core: time-limited event chatrooms
- Flow: create event → choose participants → post to board → join with status → chat during event → auto-removed after event
- After removal: uploaded media/links remain accessible in each participant’s personal archive
- Secondary: user profiles + badges; host can assign badges to participants during/after the event

Backend is NOT decided yet. For now:
- Use local mock API layer + in-memory data store (later swap to real API).
- Focus on navigation, screens, components, state management, and UX.

Deliverable in this phase:
- A working iOS app that navigates through all screens with mock data
- Solid component structure, typed models, and “API contract” interfaces
- Minimal styling but coherent, consistent UI

Non-goals (for now):
- Real authentication
- Real-time chat over websocket
- Push notifications
- Production-grade media upload
- Deep analytics

---

## 1) Product Concepts & Terms
### Event
A time-bounded activity post that becomes a “temporary chatroom”.
Fields (draft):
- id, title, description
- startTime (can be TBD), endTime
- location (optional)
- hostUserId
- visibility: public board / invite-only (start with public board)
- participants (invited + joined)
- status: Draft | Posted | Ongoing | Ended | Archived | Removed

### Join Status (Identity Level)
When a user joins an event room, they pick:
- “Going”
- “Maybe”
- “Watching”
(Names can change later; keep enum flexible.)

### Room Lifecycle
- Event posted → appears on Board
- User joins → enters Room (Chat)
- After endTime (+grace period) → Room is “removed”
- But attachments/links remain visible in “My Archive” for participants

### Badge
Host can “record a badge” for a participant for the event.
Examples:
- Spilled drink
- Asked silly question
- MVP helper
Badges show in:
- Event room participant list
- User profile history (optional; in this MVP show in Archive entry)

---

## 2) Screens (MVP UI Plan)
Use React Navigation.

### A) Auth Gate (Mock)
- For now: single “Continue as Demo User” + ability to switch user quickly (debug)
- Purpose: simulate different roles (host vs participant)

### B) Main Tabs
Bottom Tabs:
1. Board
2. Create
3. Archive
4. Profile

### 1) Board
- Feed list of posted upcoming/ongoing events
- Event card: title, time (or TBD), host, participant counts, your join status (if joined)
- Tap card → Event Detail

### 2) Event Detail
- Shows full details, participants preview, join CTA
- If user is host: edit controls + “Manage Participants”
- Actions:
  - Join (choose status)
  - If joined: Enter Room
  - If not joined: Join modal

### 3) Join Modal
- Pick join status (Going/Maybe/Watching)
- Optional: short note (later)
- Confirm → join event

### 4) Room (Chat)
- Message list + composer
- Room header shows event title and timer (until end)
- Attachments:
  - “Add Link” (MVP: paste URL)
  - “Add Photo” (MVP: choose placeholder local image OR just stub UI)
- Participants drawer:
  - list participants + their join status
  - host can assign badge (opens badge picker)

### 5) Badge Picker (Host only)
- List predefined badges + “Custom” (stub)
- Choose participant → assign badge record (eventId, participantId, badgeId, timestamp)

### 6) Create Event (Wizard / Single Screen)
Start simple with a single screen, later split to steps.
Fields:
- Title (required)
- Description
- Time: TBD toggle, start/end pickers (end optional)
- Participants (for now: select from mock user list)
- Post button → event appears in Board as Posted
After posting, host can jump into Room.

### 7) Manage Participants (Host)
- Invite list / remove / search (all mock)
- Show join statuses for those joined

### 8) Archive
- List of events you participated in whose rooms ended/removed
- Each item shows:
  - title, date, your join status
  - attachments count (photos/links)
  - badges you received in that event
- Tap → Archive Detail

### 9) Archive Detail
- Event summary (read-only)
- Attachments:
  - Links list (tap opens in browser)
  - Photos grid (MVP: placeholder thumbnails)
- Badges received

### 10) Profile
- Avatar (placeholder)
- Display name, bio
- Badge stats (count by badge)
- Settings section (mock):
  - theme toggle stub
  - logout/switch demo user

---

## 3) Navigation Structure
- RootStack
  - AuthStack (DemoLogin)
  - AppTabs
    - BoardStack: Board → EventDetail → Room
    - CreateStack: CreateEvent → (optional) ManageParticipants
    - ArchiveStack: Archive → ArchiveDetail
    - ProfileStack: Profile → (optional) EditProfile

Use typed navigation params.

---

## 4) Data Models (TypeScript)
Create `src/types/` with:
- User
- Event
- Participant (event-specific)
- Message
- Attachment (Link | Photo)
- Badge, BadgeRecord
- Enums: EventStatus, JoinStatus, AttachmentType

Ensure all screens use these shared models.

---

## 5) State Management (MVP)
Prefer a simple, scalable approach:
- Zustand store OR React Context + reducer
- Goal: keep API swap easy.

Store slices:
- auth: currentUser, switchUser()
- events: list, createEvent(), joinEvent(), endEvent(), removeEvent()
- rooms: messages by eventId, sendMessage()
- archive: derived from events + attachments
- badges: assignBadge()

Keep “mock DB” as in-memory arrays in `src/mock/db.ts`.
Expose “API-like” functions in `src/services/api.ts` returning Promises to mimic network latency.

---

## 6) Component System & UI Rules
Use a lightweight design system:
- `src/ui/`:
  - Button, Text, Card, Input, Chip, Avatar, BadgePill, Divider
- `src/components/`:
  - EventCard, ParticipantRow, MessageBubble, Composer, AttachmentList, BadgePickerSheet, JoinStatusSheet

Styling:
- Use consistent spacing scale (e.g. 4,8,12,16,20,24)
- Prefer system font; keep colors minimal
- Dark mode optional later; in MVP use simple palette.

UX rules:
- Joining an event always asks for JoinStatus.
- Room shows “Room will disappear after event ends” hint.
- Archive is always accessible if you were a participant.

---

## 7) “API Contracts” (Future Backend-Friendly)
Define interfaces in `src/services/contracts.ts`:
- `EventsAPI`: listEvents, createEvent, getEvent, joinEvent, inviteUsers, endEvent
- `ChatAPI`: listMessages, sendMessage, addAttachment
- `ProfileAPI`: getMe, updateProfile
- `BadgesAPI`: listBadges, assignBadge

Implement a `Mock*API` now.
Keep call sites using the interfaces (dependency injection) so backend swap is easy.

---

## 8) Milestones (What to Implement in Order)
### M1 — App skeleton
- Project scaffold, navigation, tabs, basic UI kit
- Demo login/switch user

### M2 — Board + Create + Event detail
- Create event with TBD time
- Post event to Board
- View event detail

### M3 — Join flow + Room
- JoinStatus modal
- Enter chat room, send messages (mock)
- Participant drawer

### M4 — Attachments + Archive
- Add link attachment
- Archive list/detail derived after event ends
- “Simulate end event” debug button to test lifecycle

### M5 — Badges
- Host assign badge to participant
- Show badges in room + archive + profile summary

Keep each milestone mergeable and runnable.

---

## 9) Dev Workflow for Codex
- Use git worktrees per milestone:
  - `feature/m1-skeleton`
  - `feature/m2-board-create`
  - `feature/m3-room`
  - `feature/m4-archive`
  - `feature/m5-badges`
- Each PR should include:
  - short demo notes
  - screenshots (optional)
  - TODOs for next milestone

Code quality:
- TypeScript strict
- eslint/prettier or biome (choose one)
- Avoid complex abstractions early; keep it readable.

---

## 10) Acceptance Criteria (MVP)
A build is “done” when:
- You can create an event and see it in Board
- Another demo user can join with status and enter the room
- Chat messages appear in the room
- Host can assign a badge to a participant
- Ending the event moves it to Archive and room is no longer accessible
- Archive shows links/photos (placeholder ok) and badges

---

## 11) File/Folder Layout (Suggested)
src/
  app/
    navigation/
    screens/
  components/
  ui/
  services/
    api.ts
    contracts.ts
  mock/
    db.ts
    seed.ts
  store/
  types/
  utils/

---

## 12) Notes / Open Questions (Do NOT block MVP)
- Grace period after endTime (e.g. 2 hours) before room removal
- Invite-only events vs public board
- Media upload pipeline choice depends on backend
- Real-time chat (websocket) later

Focus on UI + lifecycle simulation first.
