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

### 2. The Contemporary Letter & Sealed Envelope
*An unhurried space for deeper vulnerability, tactile stationery, and tuck-in keepsakes.*

- **Stationery Paper Stock (Strictly White & Cream Variations — No Sage):**
  1. *Pure White Wove* (Crisp, clean, smooth cotton tooth)
  2. *Cloud Dancer Cream* (Airy, warm neutral paper)
  3. *Linen Cream Textured* (Subtle cross-hatch woven grain)
  4. *Soft Flecked Cotton* (Organic off-white with tiny subtle fibers)
- **Ink Colors:**
  - **Black** (`#1A1A1A`)
  - **Dark Brown** (`#382923`)
  - **Dark Blue** (`#1B263B`)
- **Decorative Ephemera & Cute Stickers:**
  - Washi tape strips, vintage paperclips, delicate stars, subtle hearts, *"i love you"* script sticker, sweet little bear, botanical flowers, quiet smiley, and other tasteful, non-cringey ephemera.
- **Customizable Delivery Envelope (4 Finishes):**
  1. *Kraft Manila* (Warm natural craft paper)
  2. *Pleated Cream Vellum* (Semi-translucent frosted envelope)
  3. *Maroon with Simple White Lace* (Deep rich maroon body with delicate white lace border trim)
  4. *Classic Charcoal Linen* (Muted dark slate paper)
- **Authentic Seal Selection:**
  - Embossed Wax Seal in: **Gold**, **Cream**, or **Maroon**.
- **Tuck-In Keepsake Enclosures:**
  - Senders can slip a physical-style white-bordered polaroid photo or additional personal token inside the envelope alongside the letter.

---

### 3. The Botanical Bouquet Atelier
*A sensory floral arrangement offering comfort, celebration, or tenderness.*

- **Botanical Flower Catalog (15 Curated Blooms):**
  1. Dahlia
  2. Tulip
  3. Gardenia
  4. Peony
  5. Lily
  6. Orchid
  7. Rose
  8. Sunflower
  9. Lilac
  10. Baby's Breath
  11. Hydrangea
  12. Snapdragon
  13. Japanese Anemones
  14. Persian Buttercup
  15. Foxglove
- **Arrangement Mode:**
  - **Bespoke Atelier:** Pick and arrange flowers stem-by-stem from the catalog.
  - **Readymade Bouquets:** Pre-arranged compositions for quick, thoughtful gifting.
- **Wrapping Paper Options (4 Choices):**
  1. *Natural Brown Kraft Paper*
  2. *Frosted Botanical Vellum*
  3. *Pleated Ivory Linen*
  4. *Vintage Newspaper Newsprint*
- **Ribbon Tie Options (4 Choices):**
  1. *Raw Frayed Silk* (Soft ecru)
  2. *Grosgrain Stripe* (Earthy olive)
  3. *Velvet Ribbon* (Deep plum)
  4. *Twisted Jute Twine* (Rustic single knot)
- **Attached Letter Tag:**
  - Florist letter card tied directly to the ribbon stems: supports unbounded personal text (no word limit).

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

### 5. Delivery Vessels (Strictly 3 Options)
Once crafted, the gift is placed inside one of **three distinct delivery vessels**:

| Vessel | Visual Metaphor | Opening Experience |
| :--- | :--- | :--- |
| **1. Envelope** | Letter/parcel envelope sealed with wax | Slide wax seal / unfold flap |
| **2. Box** | Linen-textured keepsake box tied with ribbon | Untie ribbon / lift lid |
| **3. Truck** | Miniature vintage delivery toy truck | Tap truck door / open cargo bed |

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
