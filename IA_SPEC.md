# Information Architecture & Taxonomy Specification (`IA_SPEC.md`)
*Phase 3: Object Modeling, Master Archive vs. Narrative Scrapbook, and Navigation Schema*

---

## 1. Architectural Foundation & Mental Model

### The Core IA Axioms
- **The Keepsake Shelf (Master Archive):** The permanent, automated repository of all exchanged gifts (letters, postcards, greeting cards, bouquets). Nothing given or received is ever lost. Non-gift ephemera (raw photos, ticket stubs) *never* clutter the shelf.
- **The Scrapbook (Narrative Curation):** User-authored story chapters (e.g., *"Jaipur Trip 2025"*, *"Late Night Tea"*). Chapters hold multi-media ephemera and **point/reference** gifts on the shelf without duplicating them.
- **The Relationship Log (Milestone Ledger):** A chronological spine linking special occasions (e.g., *"1 Month Special"*, *"First Apartment"*) to specific gifts or scrapbook moments.
- **My Vault (Personal Sanctuary):** Private drafts, personal reflections, unshared received items, and private tags (e.g., *"For Him"*, *"Gift Ideas"*).
- **The Universal "From: & To:" Gesture:** A cute, intimate handwritten dedication label (*"From: [Name] / To: [Name]"*) stamped or tucked onto every gift, parcel, envelope, ribbon, and keepsake—reinforcing the tactile essence of *"A little something, from me to you"*.

---

## 2. Object-Oriented UX (OOUX) Anatomy

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                OOUX OBJECT TAXONOMY                                    │
├────────────────────┬────────────────────┬────────────────────┬─────────────────────────┤
│  1. THE POSTCARD   │   2. THE LETTER    │  3. GREETING CARD  │     4. THE BOUQUET      │
│  • Front Artwork   │  • 5 Stationery    │  • Tactile Bi-fold │  • Illustrated Stems    │
│  • 3D Flip Action  │    Themes          │  • Cover Artwork   │  • Bare-stem Composition│
│  • Back Message    │  • From/To & Date  │  • Interior Spread │  • Greenery & Fillers   │
│  • Perforated Stamp│  • Slanted Engine  │  • Tuck-in Polaroid│  • Thematic Note Card   │
│  • "From & To" Tag │  • Draggable Layer │  • "From & To" Seal│  • Tap-to-Open Mini Note│
└────────────────────┴────────────────────┴────────────────────┴─────────────────────────┘
```

### Detailed Object Specifications

#### A. Digital Postcard
- **Visual Presentation:** Heavy tactile cardstock with subtle edge-wear.
- **Interaction:** Tap/swipe horizontally to perform a realistic 3D card flip.
- **Front Face:** High-resolution photo, custom illustration, or studio art.
- **Back Face:** Divided layout—left side for handwritten note; right side for address block, collectible postal date stamps, and a handwritten *"From: [Name] / To: [Name]"* mark.

#### B. Contemporary Letter & Thematic Stationery
- **Stationery Engine (5 Curated Themes):**
  1. *Crumpled Vintage Parchment:* Warm aged paper grain, clean center writing canvas, pinned From/To & Date.
  2. *Lace-Bordered Romantic:* Crimson base, delicate outer lace frame, strict interior text boundaries.
  3. *Slanted Notebook / Denim:* Slanted typography engine matching angled paper orientation on denim canvas.
  4. *Clean White Red-Ruled:* Crisp wove paper with subtle thin red horizontal ruled lines.
  5. *Wide-Format Lavender:* Extended width proportions with soft botanical mauve accents.
- **Header Architecture:** Universal pinned `From: [Name]`, `To: [Name]`, and `Date:` header across all themes.
- **Ephemera Layer:** Placement of contemporary stickers, pressed botanical stamps, and polaroid photo tuck-in.

#### C. Greeting Card
- **Visual Presentation:** Premium bi-fold card with realistic paper crease physics.
- **Interaction:** Gentle opening fold animation (lifts open like a real card, with instant-skip option).
- **Exterior Cover:** Curated festive, sentimental, or whimsical cover art; customizable cover title.
- **Interior Spread:** 
  - Left page: Optional tuck-in photo pocket (for a polaroid or keepsake snapshot).
  - Right page: Handwritten personal message spread (Black, Dark Brown, Dark Blue ink).
  - Dedication: Embossed or handwritten *"From: [Name] / To: [Name]"* closure.

#### D. Botanical Bouquet (DigiBouquet Paradigm)
- **Visual Materiality:** High-fidelity botanical flower illustrations (strictly no emojis); natural bare-stem arrangement free of artificial cellophane wrapping paper and ribbons.
- **5-Step Choreographed Creation Flow:**
  - **1. Stem Selection:** Add individual botanical flower stems from curated illustrated catalog.
  - **2. Rearrange & Reshuffle:** Reorganize, shuffle, and layer stems organically.
  - **3. Greenery & Fillers:** Add botanical foliage, eucalyptus, and fern fronds to balance the arrangement.
  - **4. Thematic Note Writing:** Select a themed card and compose an unrestricted heartfelt note.
  - **5. Dispatch & Interactive Unfolding:** The final bouquet arrives with a miniature attached note; tapping the note unfolds it into a full, readable letter view.

---

## 3. Structural Relationship Diagram

```mermaid
graph TD
    subgraph Studio [The Studio]
        Maker[Maker Canvas] --> CreateGift[Craft Gift: Postcard / Letter / Card / Bouquet]
        CreateGift --> AddDedication["Attach 'From: & To:' Dedication"]
        AddDedication --> ChooseVessel[Package in 3 Vessels: Envelope / Box / Truck]
        ChooseVessel --> Dispatch[Send to Recipient]
    end

    subgraph Shelf [The Keepsake Shelf - Master Archive]
        Dispatch --> AutoArchive[Automatic Shelf Registry]
        AutoArchive --> GiftItem["Kept Gift (Immutable Original)"]
    end

    subgraph Scrapbook [Our Scrapbook - Curated Narrative]
        ChapterA["Chapter: 'Jaipur Trip 2025'"]
        ChapterB["Chapter: 'Late Night Tea'"]
        
        GiftItem -.->|Referenced By| ChapterA
        GiftItem -.->|Referenced By| ChapterB
        
        Photo1[Trip Photo] --> ChapterA
        Ticket[Train Ticket Stub] --> ChapterA
        WrittenNote[Handwritten Inside Joke] --> ChapterB
    end

    subgraph Ledger [Relationship Log & Timeline]
        LogEntry["Milestone: '1 Month Special'"]
        GiftItem -.->|Tagged in| LogEntry
    end

    subgraph RevisitRoom [Revisit - Return Points]
        GiftItem -.->|Scheduled Return| ResurfaceTrigger[Calendar Date / Season]
        ResurfaceTrigger --> RevisitAlert[Gentle Revisit Drop]
    end

    subgraph PrivateVault [My Vault]
        PrivateDrafts[Unsent Drafts]
        PrivateNotes["Personal Tag: 'For Him'"]
    end
```

---

## 4. Top-Level Sitemap & Navigation Architecture

```
                                [ APP ENTRY ]
                                      │
        ┌───────────────┬─────────────┴─────────────┬─────────────────┐
        ▼               ▼                           ▼                 ▼
   [ STUDIO ]     [ KEEPSAKES ]               [ MY VAULT ]       [ REVISIT ]
  • Letter Desk  • Shelf (Master Gifts)      • Unsent Drafts     • Scheduled Drops
  • Postcard Lab • Scrapbook (Story Chapters)• Private Notes     • Memory Returns
  • Card Workshop• Relationship Milestone Log • Personal Tags    • Calendar Points
  • Florist Bench• Living Annotations Layer   • "For Them" Lists • Past Milestones
  • Wrapping Bar
```

### Navigation Rooms:
1. **Studio:** The crafting and wrapping atelier (Letters, Postcards, Greeting Cards, Bouquets, Delivery Vessels).
2. **Keepsakes:** The shared home (Master Keepsake Shelf + Curated Scrapbook Chapters + Relationship Milestone Log).
3. **My Vault:** The private personal haven (Unsent drafts, private notes, personal tags like *"For Him"*).
4. **Revisit:** The intentional return space (Time-scheduled memory drops, past milestone echoes, quiet future surprises).
