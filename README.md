# SoleStride 👟

**Step into your best stride.** A full-stack MERN e-commerce app for shoes — browse, filter, add to cart, and check out, with JWT-based auth and order tracking.

## Features

- 🔐 **User authentication** — register/login with JWT, passwords hashed with bcrypt
- 👟 **Product catalog** — browse shoes across running, casual, formal, sports, and sneaker categories
- 🔍 **Search, filter & sort** — search by name/brand, filter by category, sort by price or newest
- 🛒 **Cart & checkout** — persistent cart, shipping address form, cash-on-delivery checkout
- 📦 **Order history** — view past orders with status tracking (processing → shipped → delivered)
- 🔒 **Protected routes** — checkout and order pages require authentication (client + server side)

## Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- Axios
- React Hot Toast

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```
Sole-Stride/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Navbar, ProductCard, PrivateRoute
│       ├── context/        # AuthContext, CartContext
│       ├── pages/          # Home, Products, ProductDetail, Cart, Checkout, Login, Register, OrderSuccess
│       └── services/       # Axios API client
└── server/                 # Express backend
    └── src/
        ├── config/         # DB connection + seed data
        ├── middleware/     # JWT auth middleware
        ├── models/         # User, Product, Order (Mongoose schemas)
        └── routes/         # auth, products, orders
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repo
```bash
git clone https://github.com/beasthunter100/Sole-Stride.git
cd Sole-Stride
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
npm run dev
```
The API runs on `http://localhost:5000`. On first run, it seeds the database with 8 sample products.

### 3. Set up the frontend
```bash
cd ../client
npm install
```

Optionally create a `.env` file in `client/` if your API isn't on the default port:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:
```bash
npm run dev
```
The app runs on `http://localhost:5173`.

## API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | — |
| POST | `/api/auth/login` | Log in and receive a JWT | — |
| GET | `/api/auth/me` | Get current user profile | ✅ |
| GET | `/api/products` | List products (supports `category`, `search`, `sort` query params) | — |
| GET | `/api/products/:id` | Get a single product | — |
| POST | `/api/orders` | Place an order | ✅ |
| GET | `/api/orders/mine` | Get current user's orders | ✅ |
| GET | `/api/orders/:id` | Get a single order (owner only) | ✅ |

## License

This project is for personal/educational purposes.
