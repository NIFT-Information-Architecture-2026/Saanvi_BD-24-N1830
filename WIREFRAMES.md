# User Flows & Low-Fidelity Wireframes (`WIREFRAMES.md`)
*Phase 4: Choreographed Task Flows, Screen Schematics, and Spatial Architecture*

---

## 1. Choreographed Task Flows

### Flow A: The Maker’s Creation & Packaging Flow
```mermaid
graph TD
    A[Enter Studio] --> B[4-Medium Picker Carousel]
    B -->|Select Medium| C[Crafting Canvas: Letter / Postcard / Card / Bouquet]
    C --> D[Craft Artifact: Artwork, Photos, Type, Arrangement]
    D --> E["The 'From & To' Signature Tag (Final Touch)"]
    E --> F[Select Delivery Vessel: Envelope / Box / Truck / Manila Folder]
    F --> G[Dispatch & Destination Selection]
    G --> H{"Save Choice"}
    H -->|Save Copy to| I["Personal Space (e.g., 'Saanvi's Vault')"]
    H -->|Add Directly to| J["Shared Log (e.g., 'Our Little Corner')"]
    H -->|Send Only| K[Quiet Asynchronous Dispatch]
```

---

### Flow B: The Recipient’s Unwrapping & Collaborative Patina Flow
```mermaid
graph TD
    A1[App Icon / Gentle Lock-Screen Indication] --> B1[Open App: Arrival Waiting on Quiet Stand]
    B1 --> C1[Vessel Reveal Screen: Envelope / Tied Box / Vintage Truck]
    C1 --> D1{"Unwrapping Ritual"}
    D1 -->|Micro-Interaction: 1-2 sec| E1[Unfold Flaps / Untie Ribbon / Open Truck Door]
    D1 -->|Direct Tap| E1[Instant Reveal - Skip]
    E1 --> F1[Artifact Display: Flip Postcard / Open Card Spread / Bouquet View]
    F1 --> G1[Collaborative Action Bar]
    G1 --> H1[Circle/Draw Marginalia]
    G1 --> I1[Attach Audio Whisper or Memory Note]
    G1 --> J1["Save Button: File to Shared Log or Personal Vault"]
    G1 --> K1["Schedule in 'Revisit' for a Future Date"]
```

---

### Flow C: The Keepsake & Scrapbook Curation Flow
```mermaid
graph TD
    A2[Keepsakes Hub] --> B2["Top Segment Toggle"]
    B2 -->|Shelf View| C2[Master Keepsake Shelf: Chronological Exchanged Gifts]
    B2 -->|Scrapbook View| D2[Curated Chapters: e.g., 'Jaipur Trip 2025']
    B2 -->|Log View| E2[Relationship Milestone Ledger]
    D2 --> F2[Open Chapter]
    F2 --> G2["Pin Gift from Shelf + Add Photos + Ticket Stubs"]
    G2 --> H2[Non-destructive Reference Saved]
```

---

## 2. Low-Fidelity Screen Schematics (ASCII Wireframes)

### Screen 1: App Shell & Global Navigation (Mobile 390x844)
```
┌─────────────────────────────────────────┐
│ 09:41                             5G 🪫 │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│            [ ACTIVE ROOM ]              │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│    [✏️ Studio]   [🎁 Keepsakes]          │
│    [🔒 My Vault] [🕰️ Revisit]            │
└─────────────────────────────────────────┘
```

---

### Screen 2: The Studio — 4-Medium Atelier Picker
```
┌─────────────────────────────────────────┐
│ 09:41                                   │
│                                         │
│ THE STUDIO                              │
│ What would you like to make today?      │
│                                         │
│ ┌───────────────────┐ ┌───────────────┐ │
│ │  ✉️ LETTER         │ │ 🪪 POSTCARD   │ │
│ │  Quiet handwriting│ │ Two-sided flip│ │
│ └───────────────────┘ └───────────────┘ │
│                                         │
│ ┌───────────────────┐ ┌───────────────┐ │
│ │  💌 GREETING CARD │ │ 💐 BOUQUET    │ │
│ │  Folded bi-fold   │ │ Stem-by-stem  │ │
│ └───────────────────┘ └───────────────┘ │
│                                         │
│ [ Recently Saved Drafts (2) ────────► ] │
└─────────────────────────────────────────┘
```

---

### Screen 3: Studio Crafting Canvas & The "From/To" Packaging Step
```
┌─────────────────────────────────────────┐
│ ◄ Back               Postcard Canvas  Next ►│
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │     [ FRONT: Photo / Artwork ]      │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│   [ 🔄 Flip to Back for Message & Stamp ]│
│                                         │
│ ─────────────────────────────────────── │
│ FINAL TOUCH: ATTACH DEDICATION          │
│ From: [ Saanvi__________ ]              │
│ To:   [ Kabir___________ ]              │
│                                         │
│ CHOOSE PACKAGING VESSEL:                │
│ (•) Parchment Envelope  ( ) Tied Box    │
│ ( ) Vintage Toy Truck   ( ) Manila File │
│                                         │
│ SAVE TO:                                │
│ [☑] Personal Space: "Saanvi's Vault"    │
│ [ ] Shared Log:     "Our Little Corner" │
│                                         │
│ [         DISPATCH GENTLY 🕊️         ]  │
└─────────────────────────────────────────┘
```

---

### Screen 4: Recipient Unwrapping & Collaborative Patina
```
┌─────────────────────────────────────────┐
│ 09:41                              ✕    │
│                                         │
│ A little something for you...           │
│                                         │
│          ┌───────────────────┐          │
│          │   [TOY TRUCK]     │          │
│          │  Tap door to open │          │
│          └───────────────────┘          │
│             From: Saanvi                │
│                                         │
│       [  Tap to Unfold / Skip  ]        │
├─────────────────────────────────────────┤
│ [AFTER UNWRAPPING REVEAL]               │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   "Thinking of you this morning..."│ │
│  │   [Postcard Front / Back Flip]    │  │
│  └───────────────────────────────────┘  │
│                                         │
│ COLLABORATIVE ACTIONS:                  │
│ [ ✏️ Circle a Detail ] [ 🎙️ Voice Note ] │
│ [ 📌 Save to Keepsakes ] [ 🕰️ Revisit Later ]│
└─────────────────────────────────────────┘
```

---

### Screen 5: The Keepsakes Hub (Uncluttered Segmented View)
```
┌─────────────────────────────────────────┐
│ 09:41                           [⚙️ Edit]│
│                                         │
│ OUR LITTLE CORNER                       │
│ 2 Years, 4 Months Together              │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [ Keepsakes ] | [Scrapbooks] | [Log]│ │  ◄ Top Segmented Toggle
│ └─────────────────────────────────────┘ │
│                                         │
│ KEEPSAKE SHELF (Master Exchanged Gifts) │
│                                         │
│ ┌───────────────┐   ┌─────────────────┐ │
│ │ 💐 Ranunculus │   │ 🪪 Jaipur Post- │ │
│ │   Bouquet     │   │    card         │ │
│ │ From Kabir    │   │ From Saanvi     │ │
│ │ Oct 2, 2026   │   │ Sep 14, 2026    │ │
│ └───────────────┘   └─────────────────┘ │
│                                         │
│ ┌───────────────┐   ┌─────────────────┐ │
│ │ ✉️ Rain Note  │   │ 💌 Birthday Card│ │
│ │ From Kabir    │   │ From Saanvi     │ │
│ └───────────────┘   └─────────────────┘ │
│                                         │
│ [+ Add to Custom Scrapbook Chapter]     │
└─────────────────────────────────────────┘
```

---

### Screen 6: The Revisit Room (Scheduled Return Points)
```
┌─────────────────────────────────────────┐
│ 09:41                          [+ Drop] │
│                                         │
│ REVISIT                                 │
│ Moments returning across time           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ UPCOMING RETURN POINT               │ │
│ │ 📅 November 14, 2026 (In 39 days)   │ │
│ │ 🎁 A surprise locked by Kabir       │ │
│ │ "Open when autumn arrives"          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ PAST ECHOES (Resurfaced Keepsakes)     │
│ ┌─────────────────────────────────────┐ │
│ │ 💌 First Anniversary Note           │ │
│ │ Resurfaced on: Sep 20, 2026         │ │
│ │ [View Original] [Read Conversation] │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```
