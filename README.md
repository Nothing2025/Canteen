# Canteen Pre-Ordering System

A full-stack canteen pre-ordering application built with **React + Vite** (frontend) and **Node.js + Express + MySQL** (backend). Supports three roles: **Student**, **Admin**, and **Staff**.

---

## 🗂 Project Structure

```
CP/
├── backend/                 # Node.js + Express API
│   ├── config/db.js         # MySQL connection pool
│   ├── controllers/         # Business logic
│   ├── middleware/          # JWT auth + role authorization
│   ├── routes/              # Express routers
│   ├── .env                 # Environment variables
│   └── server.js            # Entry point
├── frontend/                # React + Vite app
│   ├── src/
│   │   ├── api/axios.js     # Axios instance with JWT interceptor
│   │   ├── components/      # Shared components (Navbar, Sidebar, etc.)
│   │   ├── context/         # AuthContext (React Context API)
│   │   └── pages/           # student/, admin/, staff/ pages
│   └── .env                 # Vite environment variables
└── canteen_db.sql           # Full MySQL schema + seed data
```

---

## ⚙️ Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | 18.x |
| npm | 9.x |
| MySQL | 8.0+ |

---

## 🚀 Setup Instructions

### 1. Clone / Open the Project
```bash
cd d:/CP
```

### 2. Set Up the Database

Open **MySQL Workbench** or run from the command line:

```bash
mysql -u root -p < canteen_db.sql
```

This will:
- Create `canteen_db` database
- Create all 5 tables with foreign keys
- Insert a default **admin** user (`admin@canteen.com` / `Admin@123`)
- Insert a default **staff** user (`staff@canteen.com` / `Staff@123`)
- Seed 8 sample menu items for today

> ⚠️ **Change the default passwords** after your first login!

### 3. Configure the Backend

Edit `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=canteen_db
JWT_SECRET=your_very_strong_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### 4. Install Backend Dependencies & Start

```bash
cd backend
npm install
npm run dev        # Development (nodemon auto-restart)
# OR
npm start          # Production
```

The backend will be available at **http://localhost:5000**

### 5. Configure the Frontend

`frontend/.env` is already configured:
```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Install Frontend Dependencies & Start

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be available at **http://localhost:5173**

---

## 👥 Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@canteen.com | Admin@123 |
| Staff | staff@canteen.com | Staff@123 |
| Student | Register a new account | — |

> Register any new account — it gets the **student** role by default.

---

## 🗄 Database Tables

| Table | Description |
|-------|-------------|
| `users` | Stores user accounts with role (`student`, `admin`, `staff`) |
| `menu` | Menu items with price, quantity, active status and date |
| `orders` | Orders with pickup slot and status |
| `order_items` | Line items linking orders to menu items |
| `settings` | App-wide settings (order deadline time) |

---

## 🔌 API Endpoints

### Auth (`/api/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register a new student |
| POST | `/login` | Login and receive JWT |

### Menu (`/api/menu`)
| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/` | Any | Today's active items |
| GET | `/all` | Admin | All items |
| POST | `/` | Admin | Create item |
| PUT | `/:id` | Admin | Update item |
| DELETE | `/:id` | Admin | Delete item |
| PATCH | `/:id/toggle` | Admin | Toggle active status |

### Orders (`/api/orders`)
| Method | Path | Role | Description |
|--------|------|------|-------------|
| POST | `/` | Student | Place order |
| GET | `/` | Student | My orders |
| DELETE | `/:id` | Student | Cancel order |
| GET | `/analytics` | Admin | Analytics data |

### Staff (`/api/staff`)
| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/orders` | Staff/Admin | All non-cancelled orders |
| GET | `/orders/pending` | Staff/Admin | Pending orders |
| PATCH | `/orders/:id` | Staff/Admin | Update order status |
| GET | `/slots` | Staff/Admin | Distinct pickup slots today |

### Settings (`/api/settings`)
| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/deadline` | Any | Get order deadline |
| PUT | `/deadline` | Admin | Set order deadline |

---

## ✨ Features

### Student
- Browse today's menu with real-time stock levels
- Add items to cart (stored in localStorage)
- Select pickup time slot
- Place orders (deadline-aware, stock-checked with transactions)
- View full order history with item breakdown
- Cancel pending orders before the deadline

### Admin
- Add, edit, delete menu items
- Toggle item active/inactive
- Set daily order deadline
- Analytics dashboard with revenue charts and top items

### Staff
- View live orders queue (auto-refreshes every 30s)
- Filter by pickup slot
- Mark orders as **Ready** or **Completed**

---

## 🛡 Security
- Passwords hashed with **bcrypt** (10 rounds)
- **JWT** stored in localStorage, sent as `Authorization: Bearer <token>`
- Role-based middleware on every protected route
- SQL injection prevented via **parameterized queries**
- Stock deducted inside **database transactions** (prevents overselling)

---
