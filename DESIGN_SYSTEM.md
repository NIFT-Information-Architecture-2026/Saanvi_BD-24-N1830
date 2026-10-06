# Visual Design System & Tokens (`DESIGN_SYSTEM.md`)
*Phase 5: Materiality Tokens, Color Palettes, Typography Scales & Studio Artifact Configuration*

---

## 1. Design Token Architecture

### A. Atmospheric Color Tokens
Rooted in archival paper, dried botanicals, and fountain pen inks. We strictly avoid high-saturation neon, fluorescent pastels, or candy pinks.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ATMOSPHERIC PALETTE                             │
├────────────────────┬────────────────────┬──────────────────────────────┤
│  ARCHIVAL PAPER    │   BOTANICAL DYES   │       DEEP INK BASES         │
│  • #FDFBF7 Cotton  │  • #7C8B76 Sage    │  • #2C2825 Espresso Ink      │
│  • #F5EFEB Oat     │  • #A88B79 Terracotta│ • #4A443F Soft Charcoal    │
│  • #ECE6DC Parchment│ • #948E99 Lavender│  • #8C827A Muted Graphite    │
└────────────────────┴────────────────────┴──────────────────────────────┘
```

#### The 3 Subtle Accent Colors (For Postcard Front & Type):
1. **Dusty Sage** (`#7C8B76` / `#E8ECE6` Tint) — Earthy, calming, serene.
2. **Warm Terracotta** (`#A88B79` / `#F7EFEB` Tint) — Grounded warmth, nostalgic.
3. **Muted Lavender** (`#948E99` / `#EFEBF2` Tint) — Gentle, contemplative, quiet.

---

### B. Typography Scales & Pairings
The typographical system balances legible editorial structure with authentic human hand-lettering.

| Role | Font Family / Style | Optical Size & Weight | Emotional Character |
| :--- | :--- | :--- | :--- |
| **Editorial Display** | *Playfair Display / Cormorant Garamond* | 24px–32px, Regular / Italic | Poetic, archival book title feel |
| **Interface / UI** | *Plus Jakarta Sans / Inter* | 13px–15px, Medium (400–500) | Clean, invisible utility, high legibility |
| **Handwriting Script** | *Caveat / Reenie Beanie* | 18px–22px, Natural flow | Subtle, human, personal touch |
| **Postal Stamp & Date** | *Courier Prime / Space Mono* | 10px–12px, Uppercase Mono | Authentic vintage postmark & cancellation stamp |

---

### C. Materiality & Surface Tokens
- **Paper Textures:** Subtle SVG noise grain overlays (cotton rag, pressed linen, smooth cardstock).
- **Elevation & Shadows:** Ultra-soft, diffuse ambient shadows (`box-shadow: 0 4px 20px rgba(44, 40, 37, 0.06);`) mimicking real paper resting on a wooden desk.
- **Corner Radii:** Micro-rounded corners (`border-radius: 4px–6px`) replicating physical guillotine-cut paper edges.
- **Wax & Metal Finishes:** Warm terracotta, antique gold, and deep forest green wax seals with soft emboss highlights.

---

## 2. Studio Artifact Configuration Matrix

### 1. The Digital Postcard
*A tactile dispatch celebrating brevity, imagery, and collectible postal marks.*

- **Orientation:** User selects between **Portrait** (3:4 aspect) or **Landscape** (4:3 aspect).
- **Front Face:**
  - Photo attachment (uploaded personal image or curated editorial artwork).
  - Short Title (Editorial display typeface).
  - One or two-liner personal caption.
  - Palette selector: Limited strictly to the **3 subtle accent colors** (Dusty Sage, Warm Terracotta, Muted Lavender).
- **Back Face (3D Flip View):**
  - Divided cardstock layout.
  - Left column: Handwritten personal note area.
  - Right column: Address markings, collectible postal date stamp, and the universal **"From: [Name] / To: [Name]"** dedication mark.
- **Stamp Selector (4 Collectible Options):**
  1. *Wild Botanical Flora* (Pressed wildflower illustration)
  2. *Vintage Postal Sunburst* (Geometric cancellation ring with custom date)
  3. *Classic Airmail Swallow* (Avian motif with wavy cancellation lines)
  4. *Archival Seal* (Minimalist border stamp with bespoke city/monogram)

---

### 2. The Contemporary Letter & Sealed Envelope
*An unhurried space for deeper vulnerability, tactile stationery, and tuck-in keepsakes.*

- **Stationery Paper Stock (4 Tactile Choices):**
  1. *Warm Pressed Cotton* (Clean, bright, soft deckle edge)
  2. *Dusty Linen Oat* (Subtle woven cross-hatch texture)
  3. *Muted Sage Parchment* (Earthy, botanical wash)
  4. *Handmade Recycled Speckle* (Tiny flecks and organic paper fibers)
- **Typography & Formatting:**
  - Font choice: Cursive script, modern editorial serif, or gentle monospaced typewriter.
  - Adjustable ink color (Espresso, Indigo Ink, Forest Green, Charcoal).
- **Decorative Ephemera & Stickers:**
  - Pluggable sticker tray: Pressed clover, washi tape strips, vintage paperclip, ink cancellation stars.
- **Customizable Delivery Envelope (4 Finishes):**
  1. *Kraft Manila Twine* (Warm craft paper)
  2. *Pleated Cream Vellum* (Semi-translucent frosted envelope)
  3. *Sage Linen Pocket* (Textured green fabric finish)
  4. *Midnight Charcoal Envelope* (Deep contrast luxury stock)
- **Authentic Seal Selection:**
  - Embossed Wax Seal (Terracotta, Antique Gold, or Forest Green).
- **Tuck-In Polaroid Attachment:**
  - Users can slip a physical-style white-bordered polaroid photo *inside the envelope alongside the letter*.

---

### 3. The Botanical Bouquet Atelier
*A wordless, sensory arrangement offering comfort, celebration, or tenderness.*

- **Arrangement Mode:**
  - **Bespoke Atelier:** Granular stem-by-stem builder from an illustrated botanical index (Ranunculus, Olive Branch, Wild Chamomile, Sweet Pea, Eucalyptus, Dried Lavender).
  - **Readymade Bouquets:** Pre-styled arrangements for effortless, immediate gifting (*"The Morning Coffee Bundle"*, *"Quiet Meadow"*, *"Warm Hearth"*).
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
  - Florist card tied directly to the ribbon stems: supports unbounded personal text with no word limit.

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
  - Hand-drawn botanical motifs, whimsical typographic covers, minimalist frame for personal photos.
- **Interior Spread:**
  - Left page: Polaroid tuck-in or pressed flower keepsake.
  - Right page: Handwritten spread with typeface selector and ink nuance.
  - Dedication closure: Handwritten *"From: & To:"* sign-off.

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
