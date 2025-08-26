# WCart — Online Grocery Platform (MERN)

WCart is a full-stack online grocery application built with the **MERN** stack.  
Customers can browse products, add items to a **server-synced cart**, manage addresses, and place orders.  
Authentication uses **httpOnly JWT cookies** for both users and sellers. The app is a monorepo with a Vite React client and an Express + MongoDB API.

---

## ✨ Features

- Product catalog with pricing & offers
- Secure authentication (Users & Sellers) via httpOnly JWT cookies
- **Server-synced cart** (persists across sessions/devices)
- Address & order management
- Seller portal (login + auth guard)
- Cloud image hosting (Cloudinary)
- Stripe-ready checkout flow (optional)
- Dev-friendly Vite proxy (no CORS pain in local dev)

---

## 🧱 Tech Stack

- **Client:** React + Vite, Axios, React Router, React Hot Toast
- **Server:** Node.js, Express, MongoDB (Mongoose), JWT, cookie-parser
- **Infra/Services:** MongoDB Atlas, Cloudinary, (optional) Stripe
- **Auth:** Cookie-based JWT with env-aware `SameSite` / `Secure`

---

## 📂 Project Structure

```
wcart/
├─ client/                 # React + Vite frontend
│  ├─ src/
│  ├─ vite.config.{ts,js}
│  └─ package.json
├─ server/                 # Express API + MongoDB
│  ├─ routes/
│  ├─ controllers/
│  ├─ models/
│  ├─ configs/             # db, cloudinary, etc.
│  └─ package.json
└─ README.md
```

---

## ⚙️ Prerequisites

- **Node.js** 18+ (or 20+)
- **MongoDB Atlas** connection string
- (Optional) **Cloudinary** credentials
- (Optional) **Stripe** Test Secret (for checkout experiments)

---

## 🔐 Environment Variables

> **Never commit real secrets.** Use `.env` locally and provider secrets in production.  
> Consider adding `server/.env.example` and `client/.env.example` with placeholders.

### `server/.env`
```env
PORT=4000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_atlas_uri

# Auth
JWT_SECRET=your_long_random_secret

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# CORS (used in production)
FRONTEND_URL=http://localhost:5173

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_xxx
```

### `client/.env.local`
```env
# In dev we recommend the Vite proxy; point API to /api
VITE_BACKEND_URL=/api
VITE_CURRENCY=AUD
```

---

## 🧪 Local Development

### 1) Install dependencies
```bash
# from repo root
cd server && npm i
cd ../client && npm i
```

### 2) Vite proxy (recommended)
Add this to **`client/vite.config.ts`** (or `.js`) to avoid CORS while developing:
```ts
export default {
  server: {
    proxy: {
      "/api": { target: "http://localhost:4000", changeOrigin: true, secure: false }
    }
  }
}
```

Ensure Axios sends cookies and uses the proxy base:
```ts
// client/src/lib/api.ts
import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "/api",
  withCredentials: true,
});
```

### 3) Run dev servers
```bash
# terminal 1
cd server
npm run dev        # e.g., nodemon index.js

# terminal 2
cd client
npm run dev        # Vite at http://localhost:5173
```

> The client calls `/api/...` → Vite proxies to `http://localhost:4000`, so cookies work without CORS configuration.

---

## 🚀 Production Deployment

### Separate hosts (e.g., Vercel frontend + Render/Railway backend)

- **Backend CORS**
  ```js
  import cors from "cors";
  app.use(cors({
    origin: ["https://your-frontend.app"], // exact origin
    credentials: true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
  }));
  ```
- **Cookies for cross-site**
  ```js
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,                 // HTTPS in prod
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  ```
- **Client**
  ```
  VITE_BACKEND_URL=https://api.yourdomain.com
  ```

### Single origin (reverse proxy)
- Serve the frontend and **proxy `/api`** to the backend on the same domain → **no CORS needed**.

---

## 🔌 API Overview (selected)

> Inspect `server/routes/` for complete routes.

- `POST /api/user/login` — login user, sets httpOnly cookie  
- `GET  /api/user/is-auth` — return current user (requires cookie)  
- `POST /api/seller/login` — login seller, sets httpOnly cookie  
- `GET  /api/seller/is-auth` — seller auth check  
- `GET  /api/product/list` — list products  
- `POST /api/cart/update` — update the user’s cart (auth required)  
- `POST /api/order/create` — create order (optional Stripe)

**Example: update cart**
```bash
curl -i -X POST http://localhost:4000/api/cart/update   -H "Content-Type: application/json"   --cookie "token=<your_jwt_cookie>"   -d '{"cartItems":{"PRODUCT_ID_1":2,"PRODUCT_ID_2":1}}'
```

---

## 🔒 Security

- Keep secrets out of Git (`.env`, `.env.*` are **gitignored**)
- Rotate any leaked keys immediately (Stripe/Cloudinary/etc.)
- Enable **GitHub Secret Scanning** & **Push Protection**
- Use **HTTPS** in production to allow `Secure` cookies

---

## 🧰 Scripts (typical)

> See each `package.json` for the exact scripts.

**Server**
```bash
npm run dev       # start API with nodemon
npm start         # production start
```

**Client**
```bash
npm run dev       # Vite dev server
npm run build     # production build
npm run preview   # preview the build locally
```

---

## 🧭 Troubleshooting

- **401 on auth in dev**  
  Ensure Axios is created with `withCredentials: true`, and you’re using the **Vite proxy** so cookies are same-site.

- **CORS errors**  
  In dev, prefer the proxy. In prod, set exact `origin` and `credentials: true` on the backend.

- **Cart not updating**  
  Protect `/api/cart/update` with an auth middleware that reads `req.cookies.token`, sets `req.auth.userId`, and have the controller use **that** userId (not the request body).

---

## 📖 Optional: API Docs

Generate live docs with **Swagger**:
1. Annotate routes with JSDoc/OpenAPI
2. Add `swagger-jsdoc` + `swagger-ui-express`
3. Serve at `/docs` and export `openapi.json`

---

## 🤝 Contributing

- Use conventional commits (`feat:`, `fix:`, etc.)
- Open a PR with a short description and screenshots/recordings for UI changes

---

## 📝 License

MIT — see `LICENSE` (or choose your preferred license)
