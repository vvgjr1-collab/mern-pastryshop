$${\color{#f06292}\huge\mathtt{Slice\ of\ Pink}}$$

<div align="center">
A meat wholesaler's storefront — processed pork, charcuterie, steak, seafood and poultry — with one brand and two clearly marked doors: an open consumer catalogue and a gated wholesale rate card.
</div>

## What's in it

1. **Landing page** (`/`) — the six core principles, the three cold chains, sourcing, compliance, cut guides and the seasonal pre-order calendar.
2. **Inventory** (`/catalogue`) — every SKU with its chain, provenance, cut guide and spec. Filter by category, cold chain, season, or search. `/product/:id` teaches the cut.
3. **Ordering** (`/cart` → `/checkout` → `/orders`) — retail packs or wholesale cases, minimum-order rules, delivery slots/windows, standing orders, cancel and reorder.

The same SKU exists in both tracks with different pack sizes and pricing visibility. **Wholesale rates are stripped server-side for consumer requests** (`backend/src/controllers/productsController.js` → `serializeForTrack`), so they cannot leak by crafting a request.

## Backend

.env file (in `backend/`)

```
MONGO_URI
PORT

UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN

NODE_ENV=development
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
- **TailwindCSS** + **daisyUI** <span style="color:grey;">custom "slice" theme</span>
- **Axios** <span style="color:grey;">HTTP client for making API requests</span>

### Backend

- **Node.js** <span style="color:grey;">JavaScript runtime</span>
- **Express.js** <span style="color:grey;">Node.js web application framework</span>
- **MongoDB** <span style="color:grey;">NoSQL database — SKUs carry deep nested spec/provenance documents</span>
- **Upstash Redis** <span style="color:grey;">Caching and rate limiting</span>

### extra tools

- **PostCSS** <span style="color:grey;">For CSS with JavaScript plugins</span>
- **Git** <span style="color:grey;">Version control</span>
