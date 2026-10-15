# User Flows & Low-Fidelity Wireframes (`WIREFRAMES.md`)
*Phase 4: Choreographed Task Flows, Screen Schematics, and Spatial Architecture*

---

## 1. Choreographed Task Flows

### Flow A: The Maker’s Creation & Packaging Flow
```mermaid
graph TD
    A[Enter Studio] --> B[4-Medium Picker Carousel]
    B -->|Postcard| C1[Canvas: Front Photo/Art + 3D Flip Back + 20-Font Note + Stamps]
    B -->|Letter| C2[Canvas: 5 Thematic Stationeries + From/To/Date Header + Stickers]
    B -->|Greeting Card| C3[Canvas: Bi-fold Cover + Inside Spread Note + Tuck-in Slot]
    B -->|Bouquet: DigiBouquet Flow| C4[Canvas: 5-Step Bare-Stem Botanical Composition]
    
    subgraph BouquetCreationFlow [DigiBouquet 5-Step Flow]
        C4 --> BQ1[Step 1: Pick Illustrated Flower Stems]
        BQ1 --> BQ2[Step 2: Reshuffle & Rearrange Composition]
        BQ2 --> BQ3[Step 3: Add Greenery & Foliage Fillers]
        BQ3 --> BQ4[Step 4: Select Note Theme & Write Heartfelt Note]
        BQ4 --> BQ5[Step 5: Preview Assembled Bouquet with Tucked Mini Note]
    end

    C1 --> E["The 'From & To' Signature Tag (Final Touch)"]
    C2 --> E
    C3 --> E
    BQ5 --> E
    E --> F[Select Delivery Vessel: Envelope / Box / Truck]
    F -->|If Envelope Selected| F1[Choose from 5 Tactile Envelope Styles]
    F1 --> G[Dispatch & Destination Selection]
    F -->|If Box or Truck Selected| G
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
    B1 --> C1[Vessel Reveal Screen: Tactile Envelope / Keepsake Box / Vintage Van]
    C1 --> D1{"Unwrapping Ritual"}
    D1 -->|Micro-Interaction: 1-2 sec| E1[Slide Envelope Seal / Untie Box Ribbon / Open Truck Door]
    D1 -->|Direct Tap| E1[Instant Reveal - Skip]
    E1 --> F1[Artifact Display: Flip Postcard / Open Card Spread / Letter Theme / Bare-Stem Bouquet]
    F1 -->|If Bouquet| BQ_Tap[Tap Tucked Mini Note -> Unfolds Full Message]
    F1 --> G1[Collaborative Action Bar]
    BQ_Tap --> G1
    G1 --> H1[Circle/Draw Marginalia]
    G1 --> I1[Attach Memory Photo or Written Note]
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

#### Screen 2: The Studio — 4-Medium Atelier Picker
```
┌─────────────────────────────────────────┐
│ 09:41                                   │
│                                         │
│ THE STUDIO                              │
│ What would you like to make today?      │
│                                         │
│ ┌───────────────────┐ ┌───────────────┐ │
│ │  ✉️ LETTER         │ │ 🪪 POSTCARD   │ │
│ │  5 curated themes │ │ 2-sided + 20F │ │
│ └───────────────────┘ └───────────────┘ │
│                                         │
│ ┌───────────────────┐ ┌───────────────┐ │
│ │  💌 GREETING CARD │ │ 💐 BOUQUET    │ │
│ │  Folded bi-fold   │ │ Bare-stem art │ │
│ └───────────────────┘ └───────────────┘ │
│                                         │
│ [ Recently Saved Drafts (2) ────────► ] │
└─────────────────────────────────────────┘
```

---

### Screen 3: Studio Crafting Canvas & The "From/To" Packaging Step
```
┌─────────────────────────────────────────┐
│ ◄ Back               Canvas Workspace   │
├─────────────────────────────────────────┤
│ [ ACTIVE CANVAS: Postcard / Letter /   │
│   Greeting Card / Bare-Stem Bouquet ]   │
│                                         │
│ ─────────────────────────────────────── │
│ FINAL TOUCH: ATTACH DEDICATION          │
│ From: [ Saanvi__________ ]              │
│ To:   [ Kabir___________ ]              │
│                                         │
│ CHOOSE HOW IT ARRIVES:                  │
│ (•) Envelope   ( ) Keepsake Box ( ) Van │
│                                         │
│ [If Envelope Selected: 5 Tactile Styles]│
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│ │Env1│ │Env2│ │Env3│ │Env4│ │Env5│      │
│ └────┘ └────┘ └────┘ └────┘ └────┘      │
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
│ [ ✏️ Circle a Detail ] [ 📸 Add Photo ]  │
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
