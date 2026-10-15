# Visual Design System & Tokens (`DESIGN_SYSTEM.md`)
*Phase 5: Materiality Tokens, Color Palettes, Typography Scales & Studio Artifact Configuration*

---

## 1. Design Token Architecture

### A. Atmospheric Color Tokens
Rooted in clean archival paper, delicate creams, and classic fountain pen inks. Zero drop-shadows—pure, clean, tactile paper planes.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ATMOSPHERIC PALETTE                             │
├────────────────────┬────────────────────┬──────────────────────────────┤
│  ARCHIVAL PAPER    │   POSTCARD TONES   │       DEEP INK BASES         │
│  • #FFFFFF Pure    │  • #FFFFFF White   │  • #1A1A1A Black             │
│  • #F0EEE9 Cloud   │  • #F0EEE9 Cloud   │  • #382923 Dark Brown        │
│    Dancer          │    Dancer          │  • #1B263B Dark Blue         │
│  • #F4EBE5 Soft    │  • #F4EBE5 Soft    │                              │
│    Cream Blush     │    Cream Blush     │                              │
└────────────────────┴────────────────────┴──────────────────────────────┘
```

#### Postcard Front Palette:
1. **Crisp Archival White** (`#FFFFFF`)
2. **Cloud Dancer** (`#F0EEE9` — Pantone warm airy cream)
3. **Soft Cream Blush** (`#F4EBE5`)

---

### B. Typography Scales & Pairings

| Role | Font Family / Style | Optical Size & Weight | Emotional Character |
| :--- | :--- | :--- | :--- |
| **Editorial Display** | *Playfair Display / Cormorant Garamond* | 24px–32px, Regular / Italic | Poetic, archival book title feel |
| **Interface / UI** | *Plus Jakarta Sans / Inter* | 13px–15px, Medium (400–500) | Clean, invisible utility, high legibility |
| **Handwriting Script** | *Caveat / Reenie Beanie* | 18px–22px, Natural flow | Subtle, human, personal touch |
| **Postal Stamp & Date** | *Courier Prime / Space Mono* | 10px–12px, Uppercase Mono | Authentic postmark & cancellation stamp |

---

### C. Materiality & Surface Tokens
- **Paper Textures:** Subtle paper tooth/grain overlays on white and cream bases.
- **Zero Drop-Shadows:** Clean, flat, honest paper layers without artificial drop-shadow clutter.
- **Corner Radii:** Micro-rounded corners (`border-radius: 4px–6px`) mimicking physical guillotine-cut paper edges.
- **Wax & Metal Finishes:** Gold, Cream, and Maroon wax seals with delicate embossed relief.

---

## 2. Studio Artifact Configuration Matrix

### 1. The Digital Postcard
*A tactile dispatch celebrating brevity, imagery, and collectible postal marks.*

- **Orientation:** User selects between **Portrait** (3:4 aspect) or **Landscape** (4:3 aspect).
- **Front Face:**
  - Photo attachment (personal snapshot or curated artwork).
  - Short Title (Editorial display typeface).
  - One or two-liner personal caption.
  - Color options (Strictly 3 subtle tones): **Pure White**, **Cloud Dancer (`#F0EEE9`)**, and **Soft Cream Blush (`#F4EBE5`)**.
- **Back Face (3D Flip View):**
  - Divided cardstock layout.
  - Left column: Handwritten personal note area.
  - Right column: Address markings, collectible postal date stamp, and the universal **"From: [Name] / To: [Name]"** dedication mark.
- **Stamp Selector (Strictly Perforated Postage Stamp Shapes):**
  1. **Red with a Heart** (Perforated edge, crimson red background with a delicate white heart)
  2. **Pink with a Flower** (Perforated edge, soft pink background with a botanical bloom)
  3. **Yellow with a Smiley** (Perforated edge, warm sunflower yellow with a quiet smile)

---

### 2. The Contemporary Letter & Thematic Stationery
*An unhurried space for deeper vulnerability, tactile stationery, and tuck-in keepsakes.*

- **Stationery Theme Architecture (Replaces Generic Color Circles):**
  Instead of generic pastel color pickers, the Letter Workspace offers **5 Curated Stationery Themes** rooted in physical paper archives:
  1. **Theme 1: Crumpled Vintage Parchment**
     - Textured, distressed edge-wear wove paper with warm tea-stained patina.
     - Clean central writing field (cleanly masked to remove distracting pre-printed graphics/stamps).
     - Header: Pinned `From: [Name]`, `To: [Name]` on the left, `Date:` on the right.
  2. **Theme 2: Lace-Bordered Stationery**
     - Delicate romantic lace-trim outer border with deep crimson backdrop.
     - Strictly constrained writing boundaries within the interior lace frame (ribbon cropped out).
     - Pinned `From:`, `To:`, and `Date:` dedication header.
  3. **Theme 3: Slanted Notebook / Denim Stationery**
     - Informal, tilted notebook page resting on raw denim fabric.
     - Slanted typography engine: typed text flows parallel to the angled paper angle for authentic physical realism.
     - Pinned `From:`, `To:`, and `Date:` dedication header.
  4. **Theme 4: Clean White Red-Ruled Stationery**
     - Crisp, pure white cotton paper with delicate thin red horizontal ruled lines.
     - Classic epistolary format with pinned `From:`, `To:`, and `Date:` header.
  5. **Theme 5: Wide-Format Lavender / Botanical Stationery**
     - Extended horizontal aspect ratio for expansive prose.
     - Soft botanical mauve/lavender accents with pinned `From:`, `To:`, and `Date:` header.
- **Ephemera & Tuck-Ins:**
  - Draggable sticker layer (tasteful postage stamps, paper clips, pressed tokens).
  - Polaroid tuck-in enclosure slot for attaching a physical-style photo.

---

### 3. The Botanical Bouquet Atelier (DigiBouquet Paradigm)
*An organic, bare-stem floral arrangement inspired by contemporary digital floristry (DigiBouquet reference).*

- **Design Philosophy Shift:**
  - **Zero Emojis:** Strictly composed of illustrated, high-fidelity botanical flower assets.
  - **No Artificial Wrappings or Ribbons:** Stripped of unnecessary cellophane wrapping papers and oversized ribbon ties; flowers and greenery stand naturally as an organic, bare-stem hand-tied bouquet.
- **Choreographed 5-Step Creation Flow:**
  1. **Step 1: Select Flowers:** Choose individual stems from a curated index of illustrated botanicals.
  2. **Step 2: Rearrange & Reshuffle:** Dynamic layout engine allowing senders to reshuffle, reorder, and adjust stem layering for a balanced organic composition.
  3. **Step 3: Choose Greenery & Fillers:** Add complementary botanical foliage, eucalyptus sprigs, fern fronds, or baby's breath.
  4. **Step 4: Select Note Theme & Write Note:** Pick a tactile note card theme (archival parchment, minimalist cream, botanical bordered card) and write an unrestricted personal message.
  5. **Step 5: Send & Tucked Note Interaction:** 
     - The recipient receives the complete, freestanding floral arrangement with a **small note card tucked into the stems**.
     - **Interactive Tap-to-Read:** Tapping the miniature attached note triggers a smooth modal/card unfold, revealing the sender's full heartfelt note.

---

### 4. The Greeting Card Workshop
*A folded bi-fold card designed for milestones, congratulations, and inside jokes.*

- **Card Size:**
  - Standard Bi-fold (A5 folded)
  - Mini Keepsake Note (Pocket square)
- **Orientation:**
  - Portrait (Vertical fold)
  - Landscape (Horizontal tent fold)
- **Cover Templates:**
  - Hand-drawn botanical motifs, whimsical typographic covers, minimalist photo frames.
- **Interior Spread:**
  - Left page: Polaroid tuck-in or pressed flower keepsake.
  - Right page: Handwritten message spread with font selector and ink options (Black, Dark Brown, Dark Blue).
  - Dedication closure: Handwritten *"From: & To:"* sign-off.

---

### 5. Delivery Vessels & Tactile Packaging (Strictly 3 Options)
Once crafted, the gift is packaged inside one of **three distinct delivery vessels**, adhering strictly to **tactile photographic/raster materiality** (rejecting cartoonish, overly animated vector SVGs in favor of authentic physical references):

| Vessel | Visual Metaphor & Materiality | Opening Experience |
| :--- | :--- | :--- |
| **1. Envelope** | Curated tactile paper envelope with wax seal | Slide wax seal / gentle flap unfold |
| **2. Box** | Tactile vintage botanical keepsake box | Untie ribbon / lift lid |
| **3. Truck** | Miniature vintage pastel delivery van/truck | Tap truck door / open cargo bay |

#### The Envelope Selector System:
When the **Envelope** vessel is active, an integrated selector appears directly above the live preview:
- **5 Curated Envelope Designs:** Derived from authentic physical stationery references (linen grain, lace trim, floral vintage print, soft pastel, archival wove).
- **Thumbnail Specifications:** Uniform 50×50px crisp square thumbnails, evenly spaced in a centered single row (no awkward horizontal scrolling or drag overflow).
- **Progressive Disclosure:** Kept hidden by default; seamlessly appears only when the sender chooses the Envelope vessel.
- **Dispatch Choreography:** Tactile slide-in animation where the crafted letter/postcard/card slides into the selected envelope and is sealed with an embossed wax stamp.

*(Zero voice notes/audio whispers across all features — keeping the platform purely visual, written, and tactile).*

---

## 3. Editorial Voice & Microcopy Matrix

| UI Moment | Generic / Commercial Copy (Avoid) | *A Little Something* Voice (Use) |
| :--- | :--- | :--- |
| **Studio Entry** | "Create New Message / Pick Template" | *"What would you like to make today?"* |
| **Packaging Action** | "Select Delivery Method & Send" | *"Fold, wrap, and choose a vessel"* |
| **Save Action** | "Save to Cloud Database" | *"Keep in your personal vault or add to our corner"* |
| **Recipient Arrival** | "You have received a new notification" | *"A little something is waiting for you on your shelf."* |
| **Unwrapping Prompt** | "Tap to dismiss / Open" | *"Unfold gently, or tap to open directly"* |
| **Revisit Scheduling**| "Set push notification alert" | *"Choose when this memory should find its way back"* |
