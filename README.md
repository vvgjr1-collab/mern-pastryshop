$${\color{#f06292}\huge\mathtt{Slice\ of\ Pink}}$$

<div align="center">
A meat wholesaler's storefront — processed pork, charcuterie, steak, seafood and poultry — with one brand and two clearly marked doors: an open consumer catalogue and a gated wholesale rate card.
</div>

## What's in it

1. **Landing page** (`/`) — the six core principles, the three cold chains, sourcing, compliance, cut guides and the seasonal pre-order calendar.
2. **Inventory** (`/catalogue`) — every SKU with its chain, provenance, cut guide and spec. Filter by category, cold chain, season, or search. `/product/:id` teaches the cut.
3. **Ordering** (`/cart` → `/checkout` → `/orders`) — retail packs or wholesale cases, minimum-order rules, delivery slots/windows, standing orders, cancel and reorder.

Plus the shared spine: `/canada-story` (sourcing, with the live grading classes), `/cold-chain` (the lot log — two sample lots, one held and one broken, with the probe trace and a °C/°F toggle), `/cut-guide` (the carcass map, filtered by cooking method, listing the SKUs we actually carry from each primal) and `/wholesale` (the gated trade door).

The same SKU exists in both tracks with different pack sizes and pricing visibility. Case sizes, MOQ and lead time are public — a chef should see what a case looks like before applying — but **per-kg rates, trade stock and spec sheets are stripped server-side for consumer requests** (`backend/src/controllers/productsController.js` → `serializeForTrack`), so they cannot leak by crafting a request.

## Design

The whole storefront runs on design direction **1d** from the handoff: Instrument Serif display, Archivo body, IBM Plex Mono for specs and units. Bone ground, blush and loin pink fields, charcoal for trade surfaces, one ember accent for actions and Chill 400 reserved for cold-chain state. Square corners everywhere, no pills, no shadows — separation comes from hairlines and flat fields, and every action is at least 48px tall.

- Palette and fonts: `frontend/tailwind.config.js` under the `sop-*` namespace.
- Atoms (`sop-btn-*`, `sop-chip-*`, `sop-key` / `sop-val` spec rows, `sop-input`): `frontend/src/index.css`.
- Wholesale inverts to charcoal so a buyer always knows which side of the house they are on.

## Backend

.env file (in `backend/`)

```
MONGO_URI
PORT

UPSTASH_REDIS_REST_URL     # optional — without it rate limiting is skipped
UPSTASH_REDIS_REST_TOKEN

NODE_ENV=development
TRADE_AUTO_APPROVE=false   # true opens the rate card on application, for demos
```

**Seed the database you deploy against.** The catalogue, and with it the whole
Canadian sourcing story, lives in the seed — an unseeded deployment falls back
to the six demo SKUs in `frontend/src/lib/demoProducts.js`:

```
MONGO_URI="<production connection string>" npm run seed --prefix backend
```

### Run the Backend

```
cd backend
npm install
npm run seed   # loads the 16-SKU catalogue
npm run dev
```

### API

| Method | Route | Notes |
| --- | --- | --- |
| GET | `/api/products` | `?category=&chain=&search=&seasonal=` — response is track-aware |
| GET | `/api/products/:id` | includes cut guide, provenance, spec |
| POST · PUT · DELETE | `/api/products/:id` | back-office catalogue maintenance |
| GET | `/api/orders?userId=` | a buyer's order history |
| POST | `/api/orders` | server prices the order, enforces MOQ and minimum order value |
| PUT | `/api/orders/:id` | status updates |
| DELETE | `/api/orders/:id` | cancels and returns stock (does not delete the record) |
| POST | `/api/accounts/apply` | trade application, GST + FSSAI required |
| GET | `/api/accounts/me` | account status |
| PUT | `/api/accounts/:id/status` | approve / reject an application |

Wholesale requests carry an `x-account-key` header belonging to an **approved** account; anything else is served retail. Outside production, new applications are auto-approved so the trade door is walkable — in production they land as `pending`.

## Frontend

### Run the Frontend

```
cd frontend
npm install
npm run dev
```

## Tech Stack

Implemented using the MERN Stack

### Frontend

- **React**
- **Vite**
- **TailwindCSS** <span style="color:grey;">design direction 1d, `sop-*` tokens</span>
- **Axios** <span style="color:grey;">HTTP client for making API requests</span>

### Backend

- **Node.js** <span style="color:grey;">JavaScript runtime</span>
- **Express.js** <span style="color:grey;">Node.js web application framework</span>
- **MongoDB** <span style="color:grey;">NoSQL database — SKUs carry deep nested spec/provenance documents</span>
- **Upstash Redis** <span style="color:grey;">Caching and rate limiting</span>

### extra tools

- **PostCSS** <span style="color:grey;">For CSS with JavaScript plugins</span>
- **Git** <span style="color:grey;">Version control</span>
