# 🚖 Uber Clone — Full-Stack Real-Time Ride-Hailing Web App

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](LICENSE)

A modern, full-stack ride-hailing web platform inspired by Uber. Features real-time bidirectional communication between riders and drivers via WebSockets, interactive Leaflet geolocation maps, ride dispatching and acceptance workflows, and JWT-secured authentication.

---

## 🌟 Key Features

### 👤 Rider Experience
- **User Authentication**: Secure registration and login powered by JWT & bcrypt password hashing.
- **Interactive Map**: View real-time location and nearby drivers using Leaflet & OpenStreetMap.
- **Ride Booking**: Select pickup and destination points, calculate estimated distance & fare, and request a ride.
- **Live Ride Status**: Real-time status updates (*Pending* ➔ *Accepted* ➔ *In-Progress* ➔ *Completed*).
- **Ride History**: View past trips with route details, driver info, and fare summary.

### 🚗 Driver Experience
- **Driver Dashboard**: Dedicated interface for registered drivers.
- **Availability Toggle**: Go online/offline to start receiving nearby ride requests.
- **Real-Time Dispatch**: Receive instant notifications for new ride requests with pickup/drop locations.
- **Accept/Decline Rides**: Accept ride requests and broadcast live location updates to the rider.

### ⚡ Real-Time & Backend Capabilities
- **Socket.IO Integration**: Instant event broadcasting for driver locations, ride requests, and status changes.
- **Modular REST API**: Structured controllers, middleware, and routes for auth, rides, and drivers.
- **Distance & Fare Calculation**: Algorithmic distance estimation and dynamic fare computation.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Tailwind CSS, Lucide React |
| **Mapping** | Leaflet, React-Leaflet, OpenStreetMap |
| **Backend** | Node.js, Express.js |
| **Real-Time** | Socket.IO (Client & Server) |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js, CORS |
| **Environment** | Dotenv, Nodemon |

---

## 📂 Project Structure

```plaintext
uber-clone/
├── backend/
│   ├── config/             # Configuration utilities
│   ├── controllers/        # Route controllers (auth, driver, ride logic)
│   ├── middleware/         # JWT authentication & validation middleware
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── drivers.js      # Driver endpoints
│   │   └── rides.js        # Ride booking & dispatch endpoints
│   ├── utils/              # Helper utilities (distance calculation)
│   ├── .env.example        # Environment variable template
│   ├── package.json        # Backend dependencies & scripts
│   └── server.js           # HTTP & Socket.IO server entry point
│
├── frontend/
│   ├── public/             # Static public assets & HTML shell
│   ├── src/
│   │   ├── components/     # UI components (Map, RideBooking, DriverDashboard, etc.)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── pages/          # App views (Home, Login, Register, Dashboard)
│   │   ├── services/       # Axios API client & endpoints
│   │   ├── App.jsx         # Root app & route configuration
│   │   ├── index.css       # Tailwind CSS styles
│   │   └── index.js        # React DOM entry point
│   ├── tailwind.config.js  # Tailwind configuration
│   └── package.json        # Frontend dependencies & scripts
│
├── .gitignore              # Ignored files (node_modules, .env, etc.)
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16.x or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/DarshithC/Uber_clone.git
cd Uber_clone
```

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `backend/` root (or copy `.env.example`):
   ```bash
   cp .env.example .env
   ```

   Configure the variables inside `backend/.env`:
   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```
   *The React application will open on `http://localhost:3000`.*

---

## 📡 API Overview

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Log in user & receive JWT | ❌ |
| `GET` | `/api/auth/profile` | Fetch authenticated user profile | ✅ |

### Rides (`/api/rides`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/rides` | Create a new ride request | ✅ |
| `GET` | `/api/rides` | Get user ride history | ✅ |
| `GET` | `/api/rides/pending` | Fetch unassigned rides (for drivers) | ✅ |
| `GET` | `/api/rides/:id` | Get details of a specific ride | ✅ |
| `POST` | `/api/rides/accept` | Driver accepts a pending ride | ✅ |
| `PATCH` | `/api/rides/:id/status`| Update ride status (completed/cancelled) | ✅ |

### Drivers (`/api/drivers`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/drivers/register` | Register as a driver | ✅ |
| `GET` | `/api/drivers/profile` | Get driver profile and vehicle info | ✅ |
| `POST` | `/api/drivers/location` | Broadcast current GPS location | ✅ |
| `POST` | `/api/drivers/toggle-availability` | Toggle online/offline status | ✅ |
| `GET` | `/api/drivers/rides` | Fetch driver trip history | ✅ |

---

## 🔄 Real-Time WebSocket Events (Socket.IO)

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `driver-location` | Client ➔ Server | `{ driverId, coords }` | Driver sends current coordinates |
| `driver-location-update` | Server ➔ Clients | `{ driverId, coords }` | Broadcast driver movement to riders |
| `ride-request` | Client ➔ Server | `{ rideId, pickup, destination }` | Rider triggers a ride dispatch |
| `new-ride-request` | Server ➔ Drivers | Ride details | Broadcast to online drivers |
| `ride-accepted` | Client ➔ Server | `{ rideId, driverId }` | Driver accepts the request |
| `ride-accepted-update` | Server ➔ Rider | Driver & ride details | Informs rider that a driver is en route |

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project:

1. **Fork** the repository.
2. **Create** your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. **Push** to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).